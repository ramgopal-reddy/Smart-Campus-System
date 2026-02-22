// CORS Proxy Workaround for Development
// This provides alternative methods to bypass CORS issues

class CORSProxy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Public CORS proxy
        this.alternativeMethods = [
            this.tryDirectFetch.bind(this),
            this.tryJSONP.bind(this),
            this.tryProxyFetch.bind(this),
            this.tryIframePost.bind(this)
        ];
    }

    async tryDirectFetch(endpoint) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            throw new Error(`Direct fetch failed: ${error.message}`);
        }
    }

    async tryProxyFetch(endpoint) {
        try {
            const response = await fetch(`${this.proxyUrl}${this.baseUrl}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            throw new Error(`Proxy fetch failed: ${error.message}`);
        }
    }

    async tryJSONP(endpoint) {
        return new Promise((resolve, reject) => {
            const callbackName = `jsonp_callback_${Date.now()}`;
            const script = document.createElement('script');
            
            window[callbackName] = (data) => {
                document.head.removeChild(script);
                delete window[callbackName];
                resolve(data);
            };
            
            script.onerror = () => {
                document.head.removeChild(script);
                delete window[callbackName];
                reject(new Error('JSONP failed'));
            };
            
            script.src = `${this.baseUrl}${endpoint}?callback=${callbackName}`;
            document.head.appendChild(script);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (window[callbackName]) {
                    document.head.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('JSONP timeout'));
                }
            }, 10000);
        });
    }

    async tryIframePost(endpoint) {
        return new Promise((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = `cors_iframe_${Date.now()}`;
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `${this.baseUrl}${endpoint}`;
            form.target = iframe.name;
            
            // Add a dummy input if needed
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'cors_bypass';
            input.value = 'true';
            form.appendChild(input);
            
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const responseText = iframeDoc.body.innerText || iframeDoc.body.textContent;
                    if (responseText) {
                        try {
                            const data = JSON.parse(responseText);
                            resolve(data);
                        } catch (e) {
                            resolve({ raw: responseText });
                        }
                    } else {
                        reject(new Error('No response received'));
                    }
                } catch (error) {
                    reject(new Error(`Iframe access failed: ${error.message}`));
                } finally {
                    document.body.removeChild(iframe);
                    document.body.removeChild(form);
                }
            };
            
            iframe.onerror = () => {
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                reject(new Error('Iframe failed to load'));
            };
            
            form.submit();
        });
    }

    async get(endpoint) {
        let lastError;
        
        for (const method of this.alternativeMethods) {
            try {
                console.log(`Trying method: ${method.name}`);
                const result = await method(endpoint);
                console.log(`Method ${method.name} succeeded`);
                return result;
            } catch (error) {
                console.log(`Method ${method.name} failed:`, error.message);
                lastError = error;
                continue;
            }
        }
        
        throw lastError || new Error('All methods failed');
    }

    async post(endpoint, data) {
        // For POST requests, we'll primarily use the proxy method
        try {
            const formData = new URLSearchParams();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }

            const response = await fetch(`${this.proxyUrl}${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            return await response.json();
        } catch (error) {
            throw new Error(`POST request failed: ${error.message}`);
        }
    }
}

// Export for use in other files
window.CORSProxy = CORSProxy;

// Usage example:
const proxy = new CORSProxy("https://smart-campus-management-system-lcgz.onrender.com"); // Your Render URL

// GET request
const attendance = await proxy.get('/attendance_history');

// POST request
const result = await proxy.post('/mark_attendance', {
    roll_number: 'LPU2024001',
    status: 'Present',
    student_email: 'student@lpu.in'
});
//     roll_number: 'LPU2024001',
//     status: 'Present',
//     student_email: 'student@lpu.in'
// });
