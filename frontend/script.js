const API_BASE_URL = 'http://localhost:3000';

const initAnalysis = (formId, inputId, resultId, endpoint, dataKey) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const value = document.getElementById(inputId).value;
        const resultDiv = document.getElementById(resultId);
        
        resultDiv.className = 'status-box';
        resultDiv.textContent = 'Running heuristic analysis...';

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [dataKey]: value })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Analysis failed');

            resultDiv.textContent = data.message;
            resultDiv.classList.add(data.safe ? 'safe' : 'danger');
        } catch (err) {
            resultDiv.textContent = `System Error: ${err.message}`;
            resultDiv.classList.add('danger');
        }
    });
};

// Initialize listeners
initAnalysis('urlForm', 'urlInput', 'urlResult', '/check/url', 'url');
initAnalysis('emailForm', 'emailInput', 'emailResult', '/check/email', 'email');