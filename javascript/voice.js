// Funções relacionadas à voz
export function setupRecognition(onResult, onError, onEnd) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = onResult;
    recognition.onerror = onError;
    recognition.onend = onEnd;
    return recognition;
}
