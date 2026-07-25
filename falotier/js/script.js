const placements = ["#1", "#2", "#3", "#4", "#5", "#5", "#7", "#7"];

const formsContainer = document.getElementById('players-forms');
const canvasContainer = document.getElementById('players-canvas');

const emptyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Formulaire pour faire les bloc d'équipe
for(let i = 0; i < 8; i++) {
    formsContainer.innerHTML += `
        <div class="control-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0;">Case n°${i+1}</h3>
                <select style="width: auto; padding: 4px; margin: 0;" onchange="toggleMode(${i}, this.value)">
                    <option value="duo">Mode Duo</option>
                    <option value="solo">Mode Solo</option>
                </select>
            </div>

            <div class="flex-row">
                <input type="text" value="${placements[i]}" placeholder="Rang" oninput="updateText('rank-${i}', this.value)">
                <input type="text" placeholder="Pseudo" oninput="updateText('name-${i}', this.value)">
            </div>
            <input type="text" placeholder="@Twitter" oninput="updateText('twitter-${i}', this.value)">
            
            <div class="compact-colors">
                <label class="custom-label"><input type="checkbox" id="card-override-${i}" onchange="toggleCardColors(${i})"> Couleurs sur mesure</label>
                
                <div class="color-wrap" title="Couleur de Fond">
                    <input type="color" id="card-bg-${i}" value="#244059" oninput="updateCardColor(${i})" disabled>
                    <button type="button" id="btn-bg-${i}" class="btn-eyedropper-mini" onclick="pickColor('card-bg-${i}', this)" disabled>🖌</button>
                </div>
                
                <div class="color-wrap" title="Couleur des Bordures">
                    <input type="color" id="card-border-${i}" value="#66c2f5" oninput="updateCardColor(${i})" disabled>
                    <button type="button" id="btn-border-${i}" class="btn-eyedropper-mini" onclick="pickColor('card-border-${i}', this)" disabled>🖌</button>
                </div>
                
                <div class="color-wrap" title="Couleur du Nom/Réseaux">
                    <input type="color" id="card-info-${i}" value="#33718f" oninput="updateCardColor(${i})" disabled>
                    <button type="button" id="btn-info-${i}" class="btn-eyedropper-mini" onclick="pickColor('card-info-${i}', this)" disabled>🖌</button>
                </div>

                <div class="color-wrap" title="Texte Rang (#1)">
                    <input type="color" id="card-rank-${i}" value="#ffffff" oninput="updateCardColor(${i})" disabled>
                    <button type="button" id="btn-rank-${i}" class="btn-eyedropper-mini" onclick="pickColor('card-rank-${i}', this)" disabled>🖌</button>
                </div>

                <div class="color-wrap" title="Ombre Rang (#1)">
                    <input type="color" id="card-shadow-${i}" value="#000000" oninput="updateCardColor(${i})" disabled>
                    <button type="button" id="btn-shadow-${i}" class="btn-eyedropper-mini" onclick="pickColor('card-shadow-${i}', this)" disabled>🖌</button>
                </div>
            </div>
            
            <label id="label-perso1-${i}">Perso 1 (Haut Gauche)</label>
            <input type="file" accept="image/*" onchange="loadImage(event, 'img1-${i}')">
            <div class="slider-group">
                <div class="slider-item"><span>Zoom</span><input type="range" min="0.5" max="3" step="0.1" value="1" oninput="updateTransform(${i}, 1)"></div>
                <div class="slider-item"><span>X</span><input type="range" min="-150" max="150" value="0" oninput="updateTransform(${i}, 1)"></div>
                <div class="slider-item"><span>Y</span><input type="range" min="-150" max="150" value="0" oninput="updateTransform(${i}, 1)"></div>
            </div>

            <div id="perso2-group-${i}">
                <label>Perso 2 (Bas Droite)</label>
                <input type="file" accept="image/*" onchange="loadImage(event, 'img2-${i}')">
                <div class="slider-group">
                    <div class="slider-item"><span>Zoom</span><input type="range" min="0.5" max="3" step="0.1" value="1" oninput="updateTransform(${i}, 2)"></div>
                    <div class="slider-item"><span>X</span><input type="range" min="-150" max="150" value="0" oninput="updateTransform(${i}, 2)"></div>
                    <div class="slider-item"><span>Y</span><input type="range" min="-150" max="150" value="0" oninput="updateTransform(${i}, 2)"></div>
                </div>
            </div>
        </div>
    `;

    canvasContainer.innerHTML += `
        <div class="player-card pos-${i+1}" id="card-dom-${i}">
            <div class="card-inner">
                <div class="img-container" id="img-container-${i}">
                    <div class="rank" id="rank-${i}">${placements[i]}</div>
                    <div class="char-slot char-1"><img id="img1-${i}" src="${emptyImage}"></div>
                    <div class="char-slot char-2"><img id="img2-${i}" src="${emptyImage}"></div>
                    <div class="diagonal-line"><div class="line-inner"></div></div>
                </div>
                <div class="info-bar">
                    <div class="info-name" id="name-${i}">NOM JOUEUR</div>
                    <div class="info-twitter" id="twitter-${i}">@TWITTER</div>
                </div>
            </div>
        </div>
    `;
}

// ------ GESTION DE LA PALETTE DE REFERENCE (PIPETTE) ------
let paletteCanvas = null; 
document.getElementById('palette-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('palette-preview');
            img.onload = function() {
                paletteCanvas = document.createElement('canvas');
                paletteCanvas.width = img.naturalWidth;
                paletteCanvas.height = img.naturalHeight;
                const ctx = paletteCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// ------ FONCTIONS POUR LES COULEURS DE CASES CUSTOM ------
function toggleCardColors(i) {
    const override = document.getElementById(`card-override-${i}`).checked;
    const types = ['bg', 'border', 'info', 'rank', 'shadow'];
    types.forEach(type => {
        document.getElementById(`card-${type}-${i}`).disabled = !override;
        document.getElementById(`btn-${type}-${i}`).disabled = !override;
    });
    updateCardColor(i);
}

function updateCardColor(i) {
    const card = document.getElementById(`card-dom-${i}`);
    const override = document.getElementById(`card-override-${i}`).checked;
    
    if (override) {
        card.style.setProperty('--local-bg', document.getElementById(`card-bg-${i}`).value);
        card.style.setProperty('--local-border', document.getElementById(`card-border-${i}`).value);
        card.style.setProperty('--local-info', document.getElementById(`card-info-${i}`).value);
        card.style.setProperty('--local-rank', document.getElementById(`card-rank-${i}`).value);
        card.style.setProperty('--local-shadow', document.getElementById(`card-shadow-${i}`).value);
    } else {
        card.style.removeProperty('--local-bg');
        card.style.removeProperty('--local-border');
        card.style.removeProperty('--local-info');
        card.style.removeProperty('--local-rank');
        card.style.removeProperty('--local-shadow');
    }
}

// Changer entre 1 ou 2 persos
function toggleMode(index, mode) {
    const perso2Group = document.getElementById(`perso2-group-${index}`);
    const imgContainer = document.getElementById(`img-container-${index}`);
    const labelPerso1 = document.getElementById(`label-perso1-${index}`);

    if (mode === 'solo') {
        perso2Group.style.display = 'none'; 
        imgContainer.classList.add('solo-mode'); 
        labelPerso1.innerText = 'Personnage (Image complète)';
    } else {
        perso2Group.style.display = 'block'; 
        imgContainer.classList.remove('solo-mode'); 
        labelPerso1.innerText = 'Perso 1 (Haut Gauche)';
    }
}

function updateText(id, value) {
    document.getElementById(id).innerText = value;
}

// Fonction pour importer une image
function loadImage(event, imgId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.getElementById(imgId);
            const charIndex = imgId.split('-')[0].replace('img', ''); 
            const playerIndex = imgId.split('-')[1]; 
            const group = document.querySelectorAll('.control-group')[playerIndex].querySelectorAll('.slider-group')[charIndex - 1];
            const sliders = group.querySelectorAll('input');
            
            sliders[0].value = 1; 
            sliders[1].value = 0; 
            sliders[2].value = 0; 

            imgElement.onload = function() {
                const nw = imgElement.naturalWidth;
                const nh = imgElement.naturalHeight;
                const containerWidth = 240;
                const containerHeight = 230;
                const ratio = Math.max(containerWidth / nw, containerHeight / nh);
                
                imgElement.style.width = Math.ceil(nw * ratio) + 'px';
                imgElement.style.height = Math.ceil(nh * ratio) + 'px';
                imgElement.style.objectFit = 'fill'; 
                imgElement.style.transform = 'translate(-50%, -50%) scale(1)';
                imgElement.onload = null; 
            };
            
            imgElement.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// --- PIPETTE MAISON ET NATIVE ---
let isPicking = false;
let pickingCanvas = null;
let activeColorInput = null;

function updateCardColors() {
    const bg = document.getElementById('in-bg-color').value;
    const border = document.getElementById('in-border-color').value;
    const info = document.getElementById('in-info-color').value;
    const rank = document.getElementById('in-rank-color').value;
    const shadow = document.getElementById('in-rank-shadow').value;

    const root = document.documentElement.style;
    root.setProperty('--card-bg-color', bg);
    root.setProperty('--card-border-color', border);
    root.setProperty('--card-info-color', info);
    root.setProperty('--card-rank-color', rank);
    root.setProperty('--card-rank-shadow', shadow);
}

function rgbToHex(r, g, b) {
    const toHex = (v) => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getColorAtEvent(e) {
    if (e.target.id === 'palette-preview' && paletteCanvas) {
        const rect = e.target.getBoundingClientRect();
        const scaleX = paletteCanvas.width / rect.width;
        const scaleY = paletteCanvas.height / rect.height;
        const px = Math.floor((e.clientX - rect.left) * scaleX);
        const py = Math.floor((e.clientY - rect.top) * scaleY);
        
        if (px >= 0 && px < paletteCanvas.width && py >= 0 && py < paletteCanvas.height) {
            const ctx = paletteCanvas.getContext('2d');
            const data = ctx.getImageData(px, py, 1, 1).data;
            return rgbToHex(data[0], data[1], data[2]);
        }
        return null;
    }

    const captureZone = document.getElementById('capture-zone');
    if (captureZone.contains(e.target) && pickingCanvas) {
        const rect = captureZone.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width;
        const relY = (e.clientY - rect.top) / rect.height;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) return null;

        const px = Math.min(pickingCanvas.width - 1, Math.floor(relX * pickingCanvas.width));
        const py = Math.min(pickingCanvas.height - 1, Math.floor(relY * pickingCanvas.height));
        const ctx = pickingCanvas.getContext('2d');
        const data = ctx.getImageData(px, py, 1, 1).data;
        return rgbToHex(data[0], data[1], data[2]);
    }
    return null;
}

function onPickMove(e) {
    const hex = getColorAtEvent(e);
    const preview = document.getElementById('eyedropper-preview');
    if (hex) {
        preview.style.display = 'block';
        preview.style.left = (e.clientX + 18) + 'px';
        preview.style.top = (e.clientY + 18) + 'px';
        preview.style.background = hex;
        preview.textContent = hex;
    } else {
        preview.style.display = 'none';
    }
}

function onPickClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const hex = getColorAtEvent(e);
    if (hex && activeColorInput) {
        const inputTarget = document.getElementById(activeColorInput);
        inputTarget.value = hex;
        inputTarget.dispatchEvent(new Event('input')); 
    }
    stopPicking();
}

function onPickKeydown(e) {
    if (e.key === 'Escape') stopPicking();
}

function stopPicking() {
    if (!isPicking) return;
    isPicking = false;
    document.body.classList.remove('picking-mode');
    document.removeEventListener('mousemove', onPickMove);
    document.removeEventListener('click', onPickClick, true);
    document.removeEventListener('keydown', onPickKeydown);
    document.getElementById('eyedropper-preview').style.display = 'none';
    pickingCanvas = null;
    activeColorInput = null;
}

window.addEventListener('blur', stopPicking);

async function pickColor(inputId, btnEl) {
    if (isPicking) return;

    if (window.EyeDropper) {
        const eyeDropper = new EyeDropper();
        try {
            const result = await eyeDropper.open();
            const inputTarget = document.getElementById(inputId);
            inputTarget.value = result.sRGBHex;
            inputTarget.dispatchEvent(new Event('input')); 
        } catch (e) { } 
        return;
    }

    const originalContent = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = '⏳';

    try {
        const captureZone = document.getElementById('capture-zone');
        pickingCanvas = await htmlToImage.toCanvas(captureZone, {
            width: 1920, height: 1080, pixelRatio: 1,
            style: { transform: 'scale(1)', transformOrigin: 'top left' }
        });
    } catch (err) {
        console.error('Erreur pipette :', err);
        alert("La pipette est bloquée. Cliquez directement sur le carré de couleur pour utiliser la palette système Windows/Mac.");
        btnEl.disabled = false;
        btnEl.innerHTML = originalContent;
        return;
    }

    btnEl.disabled = false;
    btnEl.innerHTML = originalContent;

    activeColorInput = inputId;
    isPicking = true;
    document.body.classList.add('picking-mode');
    document.addEventListener('mousemove', onPickMove);
    
    setTimeout(() => {
        document.addEventListener('click', onPickClick, true);
    }, 100);
    
    document.addEventListener('keydown', onPickKeydown);
}

document.getElementById('bg-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('capture-zone').style.backgroundImage = `url(${e.target.result})`;
        }
        reader.readAsDataURL(file);
    }
});

function updateTransform(playerIndex, charIndex) {
    const group = document.querySelectorAll('.control-group')[playerIndex].querySelectorAll('.slider-group')[charIndex - 1];
    const sliders = group.querySelectorAll('input');
    const scale = sliders[0].value;
    const x = sliders[1].value;
    const y = sliders[2].value;

    const img = document.getElementById(`img${charIndex}-${playerIndex}`);
    img.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
}

// Bouton pour dl image
function downloadImage() {
    const captureZone = document.getElementById('capture-zone');
    const btn = document.getElementById('dl-button');
    
    btn.innerText = "Exportation en cours...";
    btn.style.pointerEvents = "none";

    htmlToImage.toPng(captureZone, {
        width: 1920,
        height: 1080,
        pixelRatio: 1, 
        style: {
            transform: 'scale(1)', 
            transformOrigin: 'top left'
        }
    })
    .then(function (dataUrl) {
        const link = document.createElement('a');
        link.download = 'Top8_Tournoi.png';
        link.href = dataUrl;
        link.click();
        
        btn.innerText = "Télécharger le Top 8";
        btn.style.pointerEvents = "auto";
    })
    .catch(function (error) {
        console.error('Erreur :', error);
        alert("Une erreur s'est produite lors de la génération de l'image.");
        btn.innerText = "Télécharger le Top 8";
        btn.style.pointerEvents = "auto";
    });
}

// ------ SYSTEME D'ADAPTATION DE L'ÉCRAN (ZOOM INITIAL) ------
const previewArea = document.querySelector('.preview-area');
const captureZone = document.getElementById('capture-zone');

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleRatio = Math.min((width - 40) / 1920, (height - 40) / 1080);
        captureZone.style.transform = `scale(${scaleRatio})`;
    }
});

resizeObserver.observe(previewArea);