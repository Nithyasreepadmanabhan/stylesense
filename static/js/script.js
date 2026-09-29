// ===================================================
// StyleSense Client-side Scripting
// ===================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Digital Wardrobe Live Filter Logic
    const categoryFilter = document.getElementById('filterCategory');
    const colorFilter = document.getElementById('filterColor');
    const seasonFilter = document.getElementById('filterSeason');
    const occasionFilter = document.getElementById('filterOccasion');
    const wardrobeItems = document.querySelectorAll('.wardrobe-item-card');

    function applyWardrobeFilters() {
        if (!wardrobeItems.length) return;

        const catVal = categoryFilter ? categoryFilter.value.toLowerCase() : 'all';
        const colVal = colorFilter ? colorFilter.value.toLowerCase() : 'all';
        const seaVal = seasonFilter ? seasonFilter.value.toLowerCase() : 'all';
        const occVal = occasionFilter ? occasionFilter.value.toLowerCase() : 'all';

        let visibleCount = 0;

        wardrobeItems.forEach(item => {
            const itemCat = (item.dataset.category || '').toLowerCase();
            const itemCol = (item.dataset.color || '').toLowerCase();
            const itemSea = (item.dataset.season || '').toLowerCase();
            const itemOcc = (item.dataset.occasion || '').toLowerCase();

            const matchCat = (catVal === 'all' || itemCat === catVal);
            const matchCol = (colVal === 'all' || itemCol === colVal);
            const matchSea = (seaVal === 'all' || itemSea === seaVal);
            const matchOcc = (occVal === 'all' || itemOcc === occVal);

            if (matchCat && matchCol && matchSea && matchOcc) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        const noItemsMsg = document.getElementById('noMatchingItems');
        if (noItemsMsg) {
            noItemsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
        }
    }

    if (categoryFilter) categoryFilter.addEventListener('change', applyWardrobeFilters);
    if (colorFilter) colorFilter.addEventListener('change', applyWardrobeFilters);
    if (seasonFilter) seasonFilter.addEventListener('change', applyWardrobeFilters);
    if (occasionFilter) occasionFilter.addEventListener('change', applyWardrobeFilters);

    // Reset Wardrobe Filters button
    const btnResetFilters = document.getElementById('btnResetFilters');
    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', function() {
            if (categoryFilter) categoryFilter.value = 'all';
            if (colorFilter) colorFilter.value = 'all';
            if (seasonFilter) seasonFilter.value = 'all';
            if (occasionFilter) occasionFilter.value = 'all';
            applyWardrobeFilters();
        });
    }

    // 2. Image File Upload Preview
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Quiz Option Selection Handling
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(opt => {
        opt.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                
                // Clear siblings in same question block
                const parentBlock = this.closest('.quiz-question-block');
                if (parentBlock) {
                    parentBlock.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
                }
                this.classList.add('selected');
            }
        });
    });

    // 4. Color Swatch Selector in Color Assistant
    const colorSwatches = document.querySelectorAll('.color-swatch-btn');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            const colorName = this.dataset.colorName;
            if (colorName) {
                window.location.href = `/color-assistant?color=${encodeURIComponent(colorName)}`;
            }
        });
    });

});
