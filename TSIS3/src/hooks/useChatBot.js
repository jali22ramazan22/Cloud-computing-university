import { useState, useEffect, useRef } from 'react';
import { parseUserMessage } from '../utils/chat/parser';
import { RESPONSES } from '../utils/chat/responses';
import { calculateComponent } from '../utils/pricing/index';
import { COMPUTE_TIERS, STORAGE_TIERS, DATABASE_TIERS } from '../utils/pricing/data';

const COMPONENT_PARAMS = {
  compute: ['tier', 'instances', 'hours'],
  storage: ['tier', 'volumeGb'],
  database: ['tier', 'storageGb'],
  serverless: ['invocations', 'durationMs', 'memoryMb'],
  bandwidth: ['egressGb']
};

const INITIAL_QUICK_REPLIES = ['Compute', 'Storage', 'Database', 'Serverless', 'Bandwidth'];

const createInitialState = () => {
  const saved = localStorage.getItem('cfoReactSession');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch(e) {}
  }
  return {
    phase: 'greeting', // greeting, selectingComponent, collectingInputs
    pendingComponent: null,
    pendingInputs: {},
    neededParams: [],
    estimate: { components: [], totalCost: 0 },
    messages: [
      { id: Date.now(), type: 'bot', content: RESPONSES.welcome.join('\n\n') }
    ]
  };
};

export function useChatBot() {
  const [state, setState] = useState(createInitialState);
  const [quickReplies, setQuickReplies] = useState(INITIAL_QUICK_REPLIES);
  const [isTyping, setIsTyping] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('cfoReactSession', JSON.stringify(state));
  }, [state]);

  const addMessage = (messageObj) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { ...messageObj, id: Date.now() + Math.random() }]
    }));
  };

  const setBotTypingAndReply = async (replyFn) => {
    setIsTyping(true);
    setQuickReplies([]); // Hide replies while typing
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsTyping(false);
    replyFn();
  };

  const handleUserSubmit = (text) => {
    if (!text.trim()) return;

    addMessage({ type: 'user', content: text });

    setBotTypingAndReply(() => {
      processIntent(parseUserMessage(text));
    });
  };

  const processIntent = (intent) => {
    let s = { ...state }; // snapshot for synchronous updates
    const updateState = (updates) => {
      s = { ...s, ...updates };
      setState(s);
    };

    if (intent.action === 'help') {
      addMessage({ type: 'bot', content: RESPONSES.help.join('\n\n') });
      setQuickReplies(s.phase === 'greeting' ? INITIAL_QUICK_REPLIES : ['cancel']);
      return;
    }

    if (intent.action === 'reset') {
      const resetState = {
        phase: 'greeting',
        pendingComponent: null,
        pendingInputs: {},
        neededParams: [],
        estimate: { components: [], totalCost: 0 }
      };
      updateState(resetState);
      addMessage({ type: 'bot', content: RESPONSES.cleared + '\n\n' + RESPONSES.welcome[2] });
      setQuickReplies(INITIAL_QUICK_REPLIES);
      return;
    }

    if (intent.action === 'show_breakdown') {
      addMessage({ type: 'breakdown', content: s.estimate });
      setQuickReplies(INITIAL_QUICK_REPLIES);
      return;
    }

    if (intent.action === 'cancel') {
      updateState({ phase: 'selectingComponent', pendingComponent: null, pendingInputs: {}, neededParams: [] });
      addMessage({ type: 'bot', content: RESPONSES.cancelled + '\nWhat would you like to estimate instead?' });
      setQuickReplies(INITIAL_QUICK_REPLIES);
      return;
    }

    if (intent.action === 'remove' && intent.component) {
      const comps = s.estimate.components.filter(c => c.type !== intent.component);
      const total = comps.reduce((acc, c) => acc + c.cost, 0);
      updateState({ estimate: { components: comps, totalCost: total } });
      
      addMessage({ type: 'bot', content: `✅ Removed ${intent.component} from estimate.` });
      if (comps.length > 0) {
        addMessage({ type: 'breakdown', content: s.estimate });
      }
      setQuickReplies(INITIAL_QUICK_REPLIES);
      return;
    }

    // Main collecting inputs flow
    if (s.phase === 'greeting' || s.phase === 'selectingComponent') {
       if (intent.action === 'select_component' && intent.component) {
          const comp = intent.component;
          const params = [...COMPONENT_PARAMS[comp]];
          updateState({
            phase: 'collectingInputs',
            pendingComponent: comp,
            pendingInputs: {},
            neededParams: params
          });
          
          let response = RESPONSES.componentPrompt(comp) + "\n\n";
          response += getPromptForParam(comp, params[0]);
          addMessage({ type: 'bot', content: response });
          setQuickReplies(getOptionsForParam(comp, params[0]));
          return;
       }
    }

    if (s.phase === 'collectingInputs') {
      const currentParam = s.neededParams[0];
      const comp = s.pendingComponent;
      
      let val = null;
      if (currentParam === 'tier' && intent.tier) val = intent.tier;
      else if (intent.params && intent.params.number !== undefined) val = intent.params.number;

      if (val !== null) {
        const newInputs = { ...s.pendingInputs, [currentParam]: val };
        const newNeeded = s.neededParams.slice(1);
        
        updateState({ pendingInputs: newInputs, neededParams: newNeeded });
        
        if (newNeeded.length > 0) {
          const next = newNeeded[0];
          addMessage({ type: 'bot', content: getPromptForParam(comp, next) });
          setQuickReplies(getOptionsForParam(comp, next));
        } else {
          // Commit component
          try {
            const result = calculateComponent(comp, newInputs);
            
            // Limit to 1 per component type
            const existingIndex = s.estimate.components.findIndex(c => c.type === comp);
            const newDoc = { type: comp, tier: newInputs.tier, inputs: newInputs, cost: result.cost, breakdown: result };
            
            let comps = [...s.estimate.components];
            if (existingIndex >= 0) comps[existingIndex] = newDoc;
            else comps.push(newDoc);
            
            const total = comps.reduce((acc, c) => acc + c.cost, 0);
            
            updateState({
              phase: 'selectingComponent', pendingComponent: null, pendingInputs: {}, neededParams: [],
              estimate: { components: comps, totalCost: total }
            });
            
            addMessage({ type: 'bot', content: RESPONSES.added(comp, result.cost) });
            addMessage({ type: 'breakdown', content: { components: comps, totalCost: total } });
            setQuickReplies(INITIAL_QUICK_REPLIES);
            
          } catch (e) {
             updateState({ phase: 'selectingComponent', pendingComponent: null, pendingInputs: {}, neededParams: [] });
             addMessage({ type: 'bot', content: RESPONSES.invalidInput(e.message) });
             setQuickReplies(INITIAL_QUICK_REPLIES);
          }
        }
      } else {
        addMessage({ type: 'bot', content: RESPONSES.invalidInput("I didn't understand. Expected a value") });
        setQuickReplies(['cancel']);
      }
      return;
    }

    addMessage({ type: 'bot', content: RESPONSES.unknown });
    setQuickReplies(INITIAL_QUICK_REPLIES);
  };

  return { state, handleUserSubmit, isTyping, quickReplies };
}

// Helpers
function getPromptForParam(component, param) {
  if (param === 'tier') {
    let t = [];
    if (component === 'compute') t = Object.keys(COMPUTE_TIERS);
    if (component === 'storage') t = Object.keys(STORAGE_TIERS);
    if (component === 'database') t = Object.keys(DATABASE_TIERS);
    return RESPONSES.tierPrompt(t);
  }
  if (param === 'memoryMb') return `Please enter Memory in MB (128, 256, 512, 1024, 2048):`;
  if (param === 'durationMs') return `Please enter duration in ms:`;
  return RESPONSES.numberPrompt(param);
}

function getOptionsForParam(component, param) {
  if (param === 'tier') {
    if (component === 'compute') return Object.keys(COMPUTE_TIERS);
    if (component === 'storage') return Object.keys(STORAGE_TIERS);
    if (component === 'database') return Object.keys(DATABASE_TIERS);
  }
  if (param === 'memoryMb') return ['128', '256', '512', '1024', '2048'];
  if (param === 'instances' || param === 'hours') return ['1', '3', '10', '730', 'cancel'];
  return ['cancel'];
}
