import streamlit as st
from google import genai

# --- Конфигурация страницы ---
st.set_page_config(
    page_title="Анализатор отзывов",
    page_icon="📊",
    layout="centered"
)

# --- Заголовок ---
st.title("📊 Анализатор клиентских отзывов")
st.caption("AI-инструмент для малого бизнеса — ресторан, кафе, сервис")

# --- Боковая панель ---
with st.sidebar:
    st.header("Настройки")
    api_key = st.text_input("Google Gemini API Key", type="password", placeholder="AIza...")
    st.markdown("---")
    st.markdown("**Как использовать:**")
    st.markdown("1. Вставьте API ключ")
    st.markdown("2. Введите отзывы в поле")
    st.markdown("3. Нажмите «Анализировать»")
    st.markdown("---")
    st.markdown("**Получить ключ:**")
    st.markdown("[Google AI Studio](https://aistudio.google.com/)")

# --- Основной интерфейс ---
reviews_input = st.text_area(
    "Вставьте отзывы клиентов (каждый с новой строки):",
    height=250,
    placeholder=(
        "Пример:\n"
        "Очень вкусная еда, но долго ждали заказ.\n"
        "Официант был груб, больше не приду.\n"
        "Лучший стейк в городе, обязательно вернусь!"
    )
)

analyze_btn = st.button("Анализировать", type="primary")

# --- Анализ ---
if analyze_btn:
    if not api_key:
        st.error("Введите Gemini API ключ в боковой панели.")
    elif not reviews_input.strip():
        st.error("Вставьте хотя бы один отзыв.")
    else:
        prompt = f"""Ты — AI-аналитик для малого бизнеса. Проанализируй следующие клиентские отзывы и дай структурированный отчёт на русском языке.

Отзывы:
{reviews_input}

Сформируй отчёт строго в следующем формате:

## 📈 Общая тональность
Укажи процентное соотношение: позитивных / нейтральных / негативных отзывов.

## ✅ Что хвалят клиенты
Перечисли топ-3 положительных момента (кратко, по пунктам).

## ❌ На что жалуются клиенты
Перечисли топ-3 проблемы (кратко, по пунктам).

## 💡 Рекомендации для бизнеса
Дай 3 конкретных действия для улучшения на основе отзывов.

## 📊 Статистика
- Всего отзывов проанализировано: [число]
"""

        try:
            client = genai.Client(api_key=api_key)

            with st.spinner("Анализирую отзывы..."):
                response = client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt
                )
                result_text = response.text

                # Подсчёт токенов из метаданных ответа
                tokens_in = response.usage_metadata.prompt_token_count
                tokens_out = response.usage_metadata.candidates_token_count

            st.success("Анализ завершён!")
            st.markdown("---")
            st.markdown(result_text)

            # --- D2C: FinOps метрика ---
            st.markdown("---")
            with st.expander("📉 FinOps / Мониторинг использования"):
                col1, col2 = st.columns(2)
                col1.metric("Токенов (входящие)", tokens_in)
                col2.metric("Токенов (ответ)", tokens_out)
                st.caption("Gemini 2.0 Flash (Free Tier): 1 500 запросов/день · 1M токенов/день")
                st.caption("Для production мониторинга используйте Google Cloud Billing Alerts.")

        except Exception as e:
            st.error(f"Ошибка при обращении к API: {e}")
            st.caption("Проверьте правильность API ключа и наличие интернет-соединения.")

# --- Футер ---
st.markdown("---")
st.caption("SIS Week 12 · AI Tool for SME · Powered by Google Gemini 2.0 Flash")
