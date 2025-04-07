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

    // Animate numbers on page load
    function animateValue(element, start, end, duration) {
        if (!element) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Get all elements with tree counts and animate them
    const treeCountElements = document.querySelectorAll('.leader-info p');
    treeCountElements.forEach(element => {
        const text = element.textContent;
        const count = parseInt(text.replace(/\D/g, ''));
        if (!isNaN(count)) {
            element.textContent = '0 Ağaç';
            animateValue(element, 0, count, 1500);
        }
    });

    // Add hover effect to table rows
    const tableRows = document.querySelectorAll('.leaderboard-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = '#f0f8f0';
        });
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });

    // Animate stat numbers
    const statElements = document.querySelectorAll('.stat-info p');
    statElements.forEach(element => {
        const text = element.textContent;
        if (text.includes('+')) {
            const parts = text.split('+');
            const count = parseInt(parts[0].replace(/\D/g, ''));
            if (!isNaN(count)) {
                element.textContent = '0+';
                setTimeout(() => {
                    animateValue(element, 0, count, 2000);
                    setTimeout(() => {
                        element.textContent = count.toLocaleString() + '+';
                    }, 2000);
                }, 500);
            }
        }
    });

    // Ağaç Haritası İşlevselliği
    if (document.getElementById('tree-map')) {
        // Bölge kartları işlevselliği
        const regions = document.querySelectorAll('.region');
        
        // Bölge kartlarına tıklama olayı ekle
        regions.forEach(region => {
            const regionName = region.getAttribute('data-name');
            const treeCount = region.querySelector('.tree-count').textContent;
            
            // Tıklama olayı
            region.addEventListener('click', () => {
                alert(`${regionName} Bölgesi'nde ${treeCount} ağaç dikilmiştir. Bu bölgede en çok çam, meşe ve ıhlamur ağaçları bulunmaktadır.`);
            });
            
            // Ağaç sayılarını animasyonla göster
            const countElement = region.querySelector('.tree-count');
            if (countElement) {
                const countText = countElement.textContent;
                const count = parseInt(countText.replace(/\D/g, ''));
                
                if (!isNaN(count)) {
                    countElement.textContent = '0+';
                    
                    // Bölge kartı görünür olduğunda sayıyı animasyonla göster
                    region.addEventListener('animationend', () => {
                        setTimeout(() => {
                            animateValue(countElement, 0, count, 1000);
                            setTimeout(() => {
                                countElement.textContent = count.toLocaleString() + '+';
                            }, 1000);
                        }, 300);
                    });
                }
            }
        });
        
        // Filtre işlevselliği
        const filterCheckboxes = document.querySelectorAll('.filter-options input');
        const yearFilter = document.getElementById('year-filter');
        
        // Filtreleme işlevi
        function applyFilters() {
            const selectedFilters = Array.from(filterCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.nextSibling.textContent.trim());
            
            const selectedYear = yearFilter ? yearFilter.value : 'all';
            
            // Demo amaçlı basit bir filtreleme
            regions.forEach(region => {
                // Tüm ağaçlar seçili değilse ve diğer filtreler seçili değilse gizle
                if (!selectedFilters.includes('Tüm Ağaçlar') && 
                    !selectedFilters.includes('Sadece Meyveli Ağaçlar') && 
                    !selectedFilters.includes('Sadece Endemik Türler')) {
                    region.style.display = 'none';
                } else {
                    region.style.display = 'block';
                }
                
                // Yıl filtrelemesi (demo amaçlı)
                if (selectedYear !== 'all') {
                    // Rastgele bazı bölgeleri gizle (gerçek uygulamada gerçek veriye göre filtreleme yapılır)
                    const regionName = region.getAttribute('data-name');
                    if ((regionName.length + parseInt(selectedYear)) % 3 === 0) {
                        region.style.display = 'none';
                    }
                }
            });
        }
        
        // Filtre değişikliklerini dinle
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        if (yearFilter) {
            yearFilter.addEventListener('change', applyFilters);
        }
    }

    // Add click event to "Bu Projeye Bağış Yap" buttons
    const projectButtons = document.querySelectorAll('.btn-small');
    projectButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectName = button.closest('.project-content').querySelector('h4').textContent;
            alert(`${projectName} projesine bağış yapmak için bağış sayfasına yönlendiriliyorsunuz.`);
            window.location.href = 'bagis-yap.html';
        });
    });
});
