
document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            this.querySelector('.dropdown-content').classList.toggle('show');
        });
    });

    // Close the dropdown if the user clicks outside of it
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(openDropdown => {
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            });
        }
    };
});

// Function to copy prompt to clipboard
function copyPrompt(button) {
    const promptText = button.previousElementSibling.textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        button.textContent = 'Copiado!';
        setTimeout(() => {
            button.textContent = 'Copiar';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// Function to filter prompts in biblioteca_prompts.html
function filterPrompts() {
    const input = document.getElementById('promptSearch');
    const filter = input.value.toLowerCase();
    const promptItems = document.querySelectorAll('.prompt-item');

    promptItems.forEach(item => {
        const text = item.querySelector('.prompt-text').textContent;
        if (text.toLowerCase().indexOf(filter) > -1) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}


