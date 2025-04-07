document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Donation amount selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // If custom amount button is clicked, focus on the input
            if (button.classList.contains('custom-btn')) {
                document.getElementById('custom-amount').focus();
            }
        });
    });

    // Custom amount input handling
    const customAmountInput = document.getElementById('custom-amount');
    if (customAmountInput) {
        customAmountInput.addEventListener('focus', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.custom-btn').classList.add('active');
        });
    }

    // Tree counter functionality
    const decreaseBtn = document.getElementById('decrease-trees');
    const increaseBtn = document.getElementById('increase-trees');
    const treeCountInput = document.getElementById('tree-count');
    const treeCostElement = document.getElementById('tree-cost');
    const treeImpactElement = document.getElementById('tree-impact');
    
    if (decreaseBtn && increaseBtn && treeCountInput) {
        const treeCost = 50; // Cost per tree in TL
        
        // Update tree information
        function updateTreeInfo() {
            const count = parseInt(treeCountInput.value);
            const totalCost = count * treeCost;
            
            if (treeCostElement) {
                treeCostElement.textContent = totalCost + ' TL';
            }
            
            if (treeImpactElement) {
                // Calculate approximate CO2 absorption (example values)
                const co2Absorption = count * 22; // 22kg per year per tree
                treeImpactElement.textContent = co2Absorption + ' kg CO2';
            }
        }
        
        decreaseBtn.addEventListener('click', () => {
            let count = parseInt(treeCountInput.value);
            if (count > 1) {
                treeCountInput.value = count - 1;
                updateTreeInfo();
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            let count = parseInt(treeCountInput.value);
            treeCountInput.value = count + 1;
            updateTreeInfo();
        });
        
        treeCountInput.addEventListener('change', () => {
            let count = parseInt(treeCountInput.value);
            if (isNaN(count) || count < 1) {
                treeCountInput.value = 1;
            }
            updateTreeInfo();
        });
        
        // Initialize tree information
        updateTreeInfo();
    }

    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const bankInfoDiv = document.querySelector('.bank-info');
    
    if (paymentOptions.length > 0 && bankInfoDiv) {
        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                if (option.value === 'bank-transfer') {
                    bankInfoDiv.style.display = 'block';
                } else {
                    bankInfoDiv.style.display = 'none';
                }
            });
        });
    }

    // Form submission
    const donationForm = document.getElementById('donation-form');
    
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation would go here
            
            // Show success message
            alert('Bağışınız için teşekkür ederiz! Bağışınız başarıyla alındı.');
            
            // Reset form
            donationForm.reset();
            
            // Reset UI state
            if (tabButtons.length > 0) {
                tabButtons[0].click();
            }
            
            if (amountButtons.length > 0) {
                amountButtons[0].click();
            }
            
            if (treeCountInput) {
                treeCountInput.value = 1;
                updateTreeInfo();
            }
        });
    }
});
