document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    function showAlert(message, type) {
        formMessage.textContent = message;
        formMessage.className = `alert alert-${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to alert
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Hide alert after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Show sending message
        showAlert('Sending your message...', 'warning');

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showAlert('Thank you! Your message has been sent successfully.', 'success');
                form.reset(); // Clear the form
            } else {
                showAlert(data.error || 'Failed to send message. Please try again.', 'danger');
            }
        } catch (error) {
            showAlert('An error occurred. Please try again later.', 'danger');
            console.error('Error:', error);
        } finally {
            // Re-enable button and restore original text
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
});
