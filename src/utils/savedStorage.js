export const STORAGE_KEY = 'antim_prompt_saved_prompts';

export const getSavedPrompts = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Failed to read saved prompts', err);
    return [];
  }
};

export const savePrompt = (prompt) => {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedPrompts();
    const exists = saved.some((item) => item.id === prompt.id);
    if (!exists) {
      const next = [...saved, prompt];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch (err) {
    console.error('Failed to save prompt', err);
  }
};

export const removeSavedPrompt = (promptId) => {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedPrompts();
    const next = saved.filter((item) => item.id !== promptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error('Failed to remove saved prompt', err);
  }
};

export const isPromptSaved = (promptId) => {
  if (typeof window === 'undefined') return false;
  try {
    return getSavedPrompts().some((item) => item.id === promptId);
  } catch (err) {
    console.error('Failed to check saved prompt', err);
    return false;
  }
};

export const toggleSavePrompt = (prompt) => {
  if (typeof window === 'undefined') return false;
  try {
    const saved = getSavedPrompts();
    const exists = saved.some((item) => item.id === prompt.id);
    if (exists) {
      removeSavedPrompt(prompt.id);
      return false;
    }
    savePrompt(prompt);
    return true;
  } catch (err) {
    console.error('Failed to toggle saved prompt', err);
    return false;
  }
};
