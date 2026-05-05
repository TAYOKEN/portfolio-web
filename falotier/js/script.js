        const placements = ["#1", "#2", "#3", "#4", "#5", "#5", "#7", "#7"];
        
        const formsContainer = document.getElementById('players-forms');
        const canvasContainer = document.getElementById('players-canvas');

        const emptyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        // Formulaire pour faire les bloc d'équipe loop qui en fait 8
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

            // Conteneur en mode solo
            canvasContainer.innerHTML += `
                <div class="player-card pos-${i+1}">
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
                
                btn.innerText = "⬇Télécharger le Top 8";
                btn.style.pointerEvents = "auto";
            })
            .catch(function (error) {
                console.error('Erreur :', error);
                alert("Une erreur s'est produite lors de la génération de l'image.");
                btn.innerText = "⬇Télécharger le Top 8";
                btn.style.pointerEvents = "auto";
            });
        }

        window.addEventListener('resize', () => {
            const previewArea = document.querySelector('.preview-area');
            const captureZone = document.getElementById('capture-zone');
            const scaleRatio = Math.min((previewArea.clientWidth - 40) / 1920, (previewArea.clientHeight - 40) / 1080);
            captureZone.style.transform = `scale(${scaleRatio})`;
        });
        window.dispatchEvent(new Event('resize'));
