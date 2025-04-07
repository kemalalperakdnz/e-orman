// Tree Tracking JavaScript file for Yeşil Dünya website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tree tracking functionality
    initTreeTracking();
});

// Initialize tree tracking functionality
function initTreeTracking() {
    // Load saved trees from local storage
    loadTrees();
    
    // Setup tree form submission
    setupTreeForm();
    
    // Setup filters
    setupFilters();
    
    // Initialize map (if we're on the tree tracking page)
    if (document.getElementById('map')) {
        initMap();
    }
}

// Tree data structure
let trees = [];
let filteredTrees = [];

// Load trees from local storage
function loadTrees() {
    // Try to get trees from local storage
    const savedTrees = localStorage.getItem('trees');
    
    if (savedTrees) {
        trees = JSON.parse(savedTrees);
        filteredTrees = [...trees];
        
        // Update dashboard
        updateDashboard();
        
        // Render trees
        renderTrees();
    }
}

// Save trees to local storage
function saveTrees() {
    localStorage.setItem('trees', JSON.stringify(trees));
}

// Setup tree form submission
function setupTreeForm() {
    const treeForm = document.getElementById('tree-form');
    
    if (treeForm) {
        treeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const species = document.getElementById('tree-species').value;
            const location = document.getElementById('tree-location').value;
            const plantingDate = document.getElementById('planting-date').value;
            const notes = document.getElementById('tree-notes').value;
            
            // Create new tree object
            const newTree = {
                id: Date.now(), // Use timestamp as ID
                species: species,
                location: location,
                plantingDate: plantingDate,
                notes: notes,
                addedDate: new Date().toISOString(),
                image: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(species)
            };
            
            // Add tree to array
            trees.push(newTree);
            filteredTrees = [...trees];
            
            // Save trees to local storage
            saveTrees();
            
            // Update dashboard
            updateDashboard();
            
            // Render trees
            renderTrees();
            
            // Reset form
            treeForm.reset();
            
            // Show success message
            alert('Ağaç başarıyla eklendi!');
        });
    }
}

// Setup filters
function setupFilters() {
    const speciesFilter = document.getElementById('filter-species');
    const locationFilter = document.getElementById('filter-location');
    
    if (speciesFilter) {
        speciesFilter.addEventListener('change', applyFilters);
    }
    
    if (locationFilter) {
        locationFilter.addEventListener('input', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const speciesFilter = document.getElementById('filter-species');
    const locationFilter = document.getElementById('filter-location');
    
    const speciesValue = speciesFilter ? speciesFilter.value : 'all';
    const locationValue = locationFilter ? locationFilter.value.toLowerCase() : '';
    
    // Filter trees
    filteredTrees = trees.filter(tree => {
        // Check species filter
        const speciesMatch = speciesValue === 'all' || tree.species === speciesValue;
        
        // Check location filter
        const locationMatch = !locationValue || tree.location.toLowerCase().includes(locationValue);
        
        return speciesMatch && locationMatch;
    });
    
    // Render filtered trees
    renderTrees();
}

// Render trees
function renderTrees() {
    const treeList = document.getElementById('tree-list');
    
    if (treeList) {
        // Clear tree list
        treeList.innerHTML = '';
        
        if (filteredTrees.length === 0) {
            // Show empty state
            treeList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-seedling"></i>
                    <p>Henüz ağaç eklemediniz veya filtrelere uygun ağaç bulunamadı. Yeni bir ağaç ekleyerek takibe başlayabilirsiniz.</p>
                </div>
            `;
        } else {
            // Render each tree
            filteredTrees.forEach(tree => {
                const treeCard = document.createElement('div');
                treeCard.className = 'tree-card';
                
                // Format date
                const plantingDate = new Date(tree.plantingDate);
                const formattedDate = plantingDate.toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
                
                // Calculate age
                const today = new Date();
                const ageInDays = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));
                let ageText = '';
                
                if (ageInDays < 30) {
                    ageText = `${ageInDays} gün`;
                } else if (ageInDays < 365) {
                    const ageInMonths = Math.floor(ageInDays / 30);
                    ageText = `${ageInMonths} ay`;
                } else {
                    const ageInYears = Math.floor(ageInDays / 365);
                    ageText = `${ageInYears} yıl`;
                }
                
                treeCard.innerHTML = `
                    <div class="tree-card-image">
                        <img src="${tree.image}" alt="${tree.species}">
                    </div>
                    <div class="tree-card-content">
                        <h4>${tree.species}</h4>
                        <div class="tree-card-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${tree.location}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                        </div>
                        <p><i class="fas fa-clock"></i> Yaş: ${ageText}</p>
                        ${tree.notes ? `<p><i class="fas fa-sticky-note"></i> ${tree.notes}</p>` : ''}
                        <div class="tree-card-actions">
                            <button class="btn-small" onclick="viewTreeDetails(${tree.id})">Detaylar</button>
                            <button class="btn-small btn-outline" onclick="deleteTree(${tree.id})">Sil</button>
                        </div>
                    </div>
                `;
                
                treeList.appendChild(treeCard);
            });
        }
    }
}

// Update dashboard
function updateDashboard() {
    // Update total trees
    const totalTreesElement = document.getElementById('total-trees');
    if (totalTreesElement) {
        totalTreesElement.textContent = trees.length;
    }
    
    // Update total species
    const totalSpeciesElement = document.getElementById('total-species');
    if (totalSpeciesElement) {
        const uniqueSpecies = [...new Set(trees.map(tree => tree.species))];
        totalSpeciesElement.textContent = uniqueSpecies.length;
    }
    
    // Update total locations
    const totalLocationsElement = document.getElementById('total-locations');
    if (totalLocationsElement) {
        const uniqueLocations = [...new Set(trees.map(tree => tree.location))];
        totalLocationsElement.textContent = uniqueLocations.length;
    }
    
    // Update trees this month
    const treesThisMonthElement = document.getElementById('trees-this-month');
    if (treesThisMonthElement) {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        const treesThisMonth = trees.filter(tree => {
            const treeDate = new Date(tree.addedDate);
            return treeDate >= firstDayOfMonth;
        });
        
        treesThisMonthElement.textContent = treesThisMonth.length;
    }
}

// View tree details
function viewTreeDetails(treeId) {
    const tree = trees.find(tree => tree.id === treeId);
    
    if (tree) {
        alert(`Ağaç Detayları:\n\nTür: ${tree.species}\nKonum: ${tree.location}\nDikim Tarihi: ${tree.plantingDate}\nNotlar: ${tree.notes || 'Yok'}`);
    }
}

// Delete tree
function deleteTree(treeId) {
    if (confirm('Bu ağacı silmek istediğinize emin misiniz?')) {
        // Remove tree from array
        trees = trees.filter(tree => tree.id !== treeId);
        filteredTrees = filteredTrees.filter(tree => tree.id !== treeId);
        
        // Save trees to local storage
        saveTrees();
        
        // Update dashboard
        updateDashboard();
        
        // Render trees
        renderTrees();
    }
}

// Initialize map
function initMap() {
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        // This is a placeholder for a real map implementation
        // In a real application, you would use a mapping library like Leaflet or Google Maps
        
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Harita yükleniyor... (Bu bir demo uygulamasıdır, gerçek harita gösterilmemektedir.)</p>
            </div>
        `;
    }
}

// Make functions available globally
window.viewTreeDetails = viewTreeDetails;
window.deleteTree = deleteTree;
