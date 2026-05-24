document.addEventListener('DOMContentLoaded', () => {
    console.log('Nostalgic Birthday Site Initialized!');

    // ==========================================
    // 1. Accessibility: Active Navigation Link & Keyboard Shortcuts
    // ==========================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link-retro').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
    // ==========================================
    // 2. Games Page: 3D Flip Card Keyboard Accessibility
    // ==========================================
    const flipCards = document.querySelectorAll('.flip-card-container');
    flipCards.forEach(card => {
        // Add focus and click handlers
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-haspopup', 'true');
        card.setAttribute('aria-expanded', 'false');

        const innerCard = card.querySelector('.flip-card-inner');

        const toggleFlip = () => {
            const isFlipped = innerCard.classList.toggle('flipped');
            card.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
        };

        card.addEventListener('click', toggleFlip);

        card.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault(); // Prevent page scroll on space
                toggleFlip();
            }
        });
    });
    // ==========================================
    // 3. Karaoke Player (Cake & Karaoke Page)
    // ==========================================
    const karaokeContainer = document.querySelector('.karaoke-player-container');
    if (karaokeContainer) {
        const playBtn = document.getElementById('play-btn');
        const songLabel = document.getElementById('current-song-label');
        const lyricText = document.getElementById('lyric-text');
        const playlistItems = document.querySelectorAll('.playlist-item');
        const gearLeft = document.querySelector('.gear-left');
        const gearRight = document.querySelector('.gear-right');
        const liveAnnounce = document.getElementById('accessibility-announcer');
        // Retro lyrics arrays with timestamps (simulated seconds)
        const songsData = {
            'song1': {
                title: "הילדים של היום VS פעם",
                lyrics: [
                    { time: 0, text: "🎵 (מנגינת פתיחה קצבית משנות ה-90) 🎵" },
                    { time: 3, text: "זוכרים שפעם ימי הולדת היו בלי סמארטפונים?" },
                    { time: 7, text: "רק בלון תלוי בסלון וחטיפים צבעוניים!" },
                    { time: 11, text: "היום יש לנו כאבי גב וחשבון חשמל מנופח..." },
                    { time: 15, text: "אבל בלב כולנו עוד זוכרים את הטרופית והשוקולד!" },
                    { time: 19, text: "בואו נרים כוס בירה ונשיר מכל הלב! 🍻" },
                    { time: 23, text: "🎵 (סולו גיטרה אלקטרוני נוסטלגי) 🎵" },
                    { time: 27, text: "תודה ששרתם איתנו! להמשך השיר לחצו שוב." }
                ]
            },
            'song2': {
                title: "עוגת שוקולד מלבנית (רמיקס נוסטלגי)",
                lyrics: [
                    { time: 0, text: "🎵 (מנגינת קלידים נוסטלגית ושמחה) 🎵" },
                    { time: 3, text: "עוגה עוגה עוגה, במעגל נחוגה..." },
                    { time: 7, text: "אבל רגע, איפה דף הסוכר עם התמונה המביכה?" },
                    { time: 11, text: "שמנת מתוקה, שוקולית וסוכריות צבעוניות!" },
                    { time: 15, text: "פרוסה אחת ענקית ואנחנו מסודרים לכל החיים!" },
                    { time: 19, text: "בלי קמח כוסמין ובלי סוכר קוקוס - רק קלאסיקה! 🍫" },
                    { time: 23, text: "כי עוגת גן היא הבריאות האמיתית לנשמה!" },
                    { time: 27, text: "יאמי! יום הולדת שמח! 🎉" }
                ]
            },
            'song3': {
                title: "בלדה לטרופית של אהבה",
                lyrics: [
                    { time: 0, text: "🎵 (מנגינה איטית ומרגשת בסגנון פופ 90s) 🎵" },
                    { time: 3, text: "הו טרופית מתוקה שלי, קרה ומרעננת..." },
                    { time: 7, text: "מנסה להכניס את הקשית בלי לעשות חור בצד..." },
                    { time: 11, text: "מי היה מאמין ששפריץ קטן ילכלך את כל החולצה?" },
                    { time: 15, text: "היום אנחנו מעדיפים לשתות צ'ייסרים בגינה..." },
                    { time: 19, text: "אבל הטעם שלך, טרופית, לעולם לא יישכח! 🍍" },
                    { time: 23, text: "תרימו צ'ייסר לילדות הכי יפה שהייתה פה!" },
                    { time: 27, text: "סוף השיר, קחו עוד שלוק! ❤️" }
                ]
            }
        };
        let currentSongId = 'song1';
        let isPlaying = false;
        let lyricInterval = null;
        let startTime = 0;
        let elapsedSeconds = 0;
        const updateLyrics = () => {
            const song = songsData[currentSongId];
            const lyricArr = song.lyrics;
            // Find the current lyric line based on elapsed time
            let currentLyric = lyricArr[0].text;
            for (let i = 0; i < lyricArr.length; i++) {
                if (elapsedSeconds >= lyricArr[i].time) {
                    currentLyric = lyricArr[i].text;
                }
            }

            if (lyricText.textContent !== currentLyric) {
                lyricText.textContent = currentLyric;
                // Screen reader announcement for new lyrics
                if (liveAnnounce) {
                    liveAnnounce.textContent = "מילת שיר: " + currentLyric;
                }
            }
        };
        const startPlayer = () => {
            isPlaying = true;
            playBtn.textContent = '⏸️ הפסק מוזיקה';
            playBtn.setAttribute('aria-label', 'הפסק מוזיקה');
            karaokeContainer.classList.add('playing');

            startTime = Date.now() - (elapsedSeconds * 1000);
            lyricInterval = setInterval(() => {
                elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

                // Loop song if it reaches the end (30s max for demo)
                if (elapsedSeconds > 30) {
                    elapsedSeconds = 0;
                    startTime = Date.now();
                }

                updateLyrics();
            }, 500);
        };
        const stopPlayer = () => {
            isPlaying = false;
            playBtn.textContent = '▶️ נגן קריוקי מדומה!';
            playBtn.setAttribute('aria-label', 'נגן קריוקי מדומה');
            karaokeContainer.classList.remove('playing');
            clearInterval(lyricInterval);
        };
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopPlayer();
            } else {
                startPlayer();
            }
        });
        playlistItems.forEach(item => {
            item.addEventListener('click', () => {
                // Stop current
                stopPlayer();
                elapsedSeconds = 0;

                // Remove active class
                playlistItems.forEach(p => p.classList.remove('active'));
                item.classList.add('active');

                currentSongId = item.getAttribute('data-song-id');
                const song = songsData[currentSongId];

                songLabel.textContent = song.title;
                lyricText.textContent = song.lyrics[0].text;

                if (liveAnnounce) {
                    liveAnnounce.textContent = "החלפת שיר ל: " + song.title;
                }

                // Start playing the new one
                startPlayer();
            });
            // Handle keyboard navigation for playlist
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }
    // ==========================================
    // 4. Cake Recipe Interactive Checklist (Cake Page)
    // ==========================================
    const checklistItems = document.querySelectorAll('.checklist-retro li');
    if (checklistItems.length > 0) {
        const totalIngredients = checklistItems.length;
        const progressAnnounce = document.getElementById('accessibility-announcer');
        checklistItems.forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'checkbox');
            item.setAttribute('aria-checked', 'false');
            const toggleCheck = () => {
                const isChecked = item.classList.toggle('checked');
                item.setAttribute('aria-checked', isChecked ? 'true' : 'false');

                // Count checked
                const checkedCount = document.querySelectorAll('.checklist-retro li.checked').length;

                // Accessibility announcement
                if (progressAnnounce) {
                    progressAnnounce.textContent = `סימנת ${item.textContent.trim()}. סומנו ${checkedCount} מתוך ${totalIngredients} מצרכים.`;
                }
                // Celebrate if all checked
                if (checkedCount === totalIngredients) {
                    setTimeout(() => {
                        alert("כל הכבוד! כל המצרכים מוכנים. יאללה לאפות! 🎂");
                    }, 200);
                }
            };
            item.addEventListener('click', toggleCheck);
            item.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleCheck();
                }
            });
        });
    }
    // ==========================================
    // 5. Recipe Prep Step-by-Step Wizard (Cake Page)
    // ==========================================
    const stepSection = document.querySelector('.step-container');
    if (stepSection) {
        const nextBtn = document.getElementById('next-step-btn');
        const prevBtn = document.getElementById('prev-step-btn');
        const stepText = document.getElementById('step-instruction-text');
        const stepTitle = document.getElementById('step-title-display');
        const progressBar = document.querySelector('.progress-retro-bar');
        const progressAnnounce = document.getElementById('accessibility-announcer');
        const steps = [
            {
                title: "שלב 1: חימום התנור 🔥",
                desc: "חממו את התנור מראש לטמפרטורה של 180 מעלות (חום עליון-תחתון). ודאו שרשת התנור ממוקמת במרכז."
            },
            {
                title: "שלב 2: ערבוב היבשים 🥣",
                desc: "בקערה גדולה, ערבבו יחדיו את כל החומרים היבשים: כוס שוקולית, כוס קמח לבן וחצי כוס סוכר. השתמשו במטרפה כדי לפתוח גושים."
            },
            {
                title: "שלב 3: איחוד הבלילה 🥛",
                desc: "הוסיפו לקערת היבשים את החומרים הרטובים: רבע כוס שמן, 3 ביצים וחצי קופסת שמנת מתוקה (125 גרם). ערבבו בעדינות רק עד שמתקבלת בלילה חלקה ללא גושים."
            },
            {
                title: "שלב 4: אפייה בתנור ⏰",
                desc: "שמנו תבנית מלבנית, העבירו אליה את הבלילה החלקה והכניסו לתנור למשך 30 דקות. בדקו יציבות בעזרת קיסם (הוא צריך לצאת יבש עם פירורים לחים)."
            },
            {
                title: "שלב 5: הכנת הציפוי והקישוט 🍫",
                desc: "להמיס בסיר קטן 200 גרם שוקולד עם חצי חבילת שמנת מתוקה. כשהעוגה מצטננת, שפכו את הציפוי מעל, קשטו בסוכריות צבעוניות, קצפת, ואל תשכחו להשאיר מקום לדף הסוכר המביך שלכם!"
            }
        ];
        let currentStepIdx = 0;
        const updateStepWizard = () => {
            const step = steps[currentStepIdx];
            stepTitle.textContent = step.title;
            stepText.textContent = step.desc;
            // Update button states
            prevBtn.disabled = currentStepIdx === 0;
            nextBtn.textContent = currentStepIdx === steps.length - 1 ? '✨ העוגה מוכנה! ✨' : 'הבא ⬅️';

            // Update neobrutalist progress bar
            const progressPercent = ((currentStepIdx + 1) / steps.length) * 100;
            progressBar.style.width = `${progressPercent}%`;
            // ARIA announcements
            if (progressAnnounce) {
                progressAnnounce.textContent = `${step.title}. ${step.desc}`;
            }
        };
        nextBtn.addEventListener('click', () => {
            if (currentStepIdx < steps.length - 1) {
                currentStepIdx++;
                updateStepWizard();
            } else {
                alert("מזל טוב! עוגת יום ההולדת הנוסטלגית שלכם מוכנה! אל תשכחו לצלם ולשלוח לכל הילדים של פעם! 📸🎈");
            }
        });
        prevBtn.addEventListener('click', () => {
            if (currentStepIdx > 0) {
                currentStepIdx--;
                updateStepWizard();
            }
        });
        // Initialize first step
        updateStepWizard();
    }
    // ==========================================
    // 6. Goodie Bags 18+ Custom Interactive Builder (Goodies Page)
    // ==========================================
    // Route selection toggles
    const routeLazy = document.getElementById('route-lazy-card');
    const routeAdventurous = document.getElementById('route-adv-card');
    const sectionLazy = document.getElementById('section-lazy-ready');
    const sectionAdventurous = document.getElementById('section-adv-build');
    if (routeLazy && routeAdventurous) {
        const progressAnnounce = document.getElementById('accessibility-announcer');

        const showRoute = (route) => {
            if (route === 'lazy') {
                sectionLazy.style.display = 'block';
                sectionAdventurous.style.display = 'none';
                routeLazy.classList.add('selected');
                routeAdventurous.classList.remove('selected');
                sectionLazy.scrollIntoView({ behavior: 'smooth' });
                if (progressAnnounce) progressAnnounce.textContent = "עברתם למסלול שקיות הפתעה מוכנות מראש.";
            } else {
                sectionLazy.style.display = 'none';
                sectionAdventurous.style.display = 'block';
                routeLazy.classList.remove('selected');
                routeAdventurous.classList.add('selected');
                sectionAdventurous.scrollIntoView({ behavior: 'smooth' });
                if (progressAnnounce) progressAnnounce.textContent = "עברתם למסלול הרכבה עצמית אינטראקטיבית של שקית הפתעה.";
            }
        };
        routeLazy.addEventListener('click', () => showRoute('lazy'));
        routeAdventurous.addEventListener('click', () => showRoute('adv'));
        routeLazy.setAttribute('tabindex', '0');
        routeAdventurous.setAttribute('tabindex', '0');
        const handleKeySelect = (e, route) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                showRoute(route);
            }
        };
        routeLazy.addEventListener('keydown', (e) => handleKeySelect(e, 'lazy'));
        routeAdventurous.addEventListener('keydown', (e) => handleKeySelect(e, 'adv'));
    }
    // Interactive Bag Builder Logic
    const bagOptions = document.querySelectorAll('.bag-option-card');
    if (bagOptions.length > 0) {
        const itemsGrid = document.querySelector('.items-grid');
        const visualBag = document.getElementById('visual-bag-svg');
        const visualBagContainer = document.querySelector('.visual-bag-container');
        const bagBadgeContainer = document.querySelector('.bag-badge-container');
        const itemCountText = document.getElementById('bag-item-count');
        const checkoutBtn = document.getElementById('checkout-bag-btn');
        const progressAnnounce = document.getElementById('accessibility-announcer');
        // Selected bag type
        let selectedBagType = 'kraft';
        // Array of selected items
        let selectedItems = [];
        // Bag SVG Paths or styles depending on choice
        const bagStyles = {
            'kraft': {
                color: '#d2b48c', // Light brown paper
                pattern: 'repeating-linear-gradient(45deg, #c3a278, #c3a278 10px, #d2b48c 10px, #d2b48c 20px)'
            },
            'plastic': {
                color: '#ff2e93', // Fuchsia plastic
                pattern: 'radial-gradient(circle, #ff2e93 20%, #7b2cbf 80%)'
            },
            'neon': {
                color: '#00e5c9', // Turquoise neon pouch
                pattern: 'linear-gradient(135deg, #00e5c9 0%, #ffd166 100%)'
            }
        };
        const updateVisualBagColor = (bagType) => {
            selectedBagType = bagType;
            const bagStyle = bagStyles[bagType];

            // Update background of SVG or style
            const paths = visualBag.querySelectorAll('path');
            if (paths.length > 0) {
                paths.forEach(path => {
                    path.style.fill = bagStyle.color;
                    path.style.stroke = '#1e1a3c';
                });
            }
        };
        bagOptions.forEach(card => {
            card.setAttribute('tabindex', '0');

            const selectBag = () => {
                bagOptions.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                const type = card.getAttribute('data-bag-type');
                updateVisualBagColor(type);

                if (progressAnnounce) {
                    progressAnnounce.textContent = `בחרת בשקית סוג: ${card.querySelector('h4').textContent.trim()}.`;
                }
            };
            card.addEventListener('click', selectBag);
            card.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    selectBag();
                }
            });
        });
        // Particle effect when item is added
        const playAddParticle = (buttonElement, emoji) => {
            const particle = document.createElement('div');
            particle.className = 'flying-particle';
            particle.textContent = emoji;

            // Get starting coordinates
            const startRect = buttonElement.getBoundingClientRect();
            particle.style.left = `${startRect.left + startRect.width / 2}px`;
            particle.style.top = `${startRect.top + startRect.height / 2}px`;

            document.body.appendChild(particle);

            // Get destination coordinates (visual bag container)
            const destRect = visualBagContainer.getBoundingClientRect();
            const destX = destRect.left + destRect.width / 2;
            const destY = destRect.top + destRect.height / 2;

            // Animate particle to bag
            setTimeout(() => {
                particle.style.transform = `translate(${destX - startRect.left}px, ${destY - startRect.top}px) scale(0.5)`;
                particle.style.opacity = '0';
            }, 50);

            // Clean up and shake bag
            setTimeout(() => {
                particle.remove();
                visualBagContainer.classList.add('shake-bag');
                setTimeout(() => {
                    visualBagContainer.classList.remove('shake-bag');
                }, 500);
            }, 650);
        };
        // Add click to add item grid
        const itemCards = document.querySelectorAll('.item-add-card');
        itemCards.forEach(card => {
            card.setAttribute('tabindex', '0');

            const toggleItem = () => {
                const itemTitle = card.querySelector('.item-add-title').textContent.trim();
                const itemIcon = card.querySelector('.item-add-icon').textContent.trim();
                const itemId = card.getAttribute('data-item-id');

                const index = selectedItems.findIndex(i => i.id === itemId);

                if (index === -1) {
                    // Add item
                    selectedItems.push({ id: itemId, title: itemTitle, icon: itemIcon });
                    card.classList.add('in-bag');
                    card.querySelector('.btn-add-item').textContent = 'הסר מהשקית';

                    playAddParticle(card, itemIcon);

                    if (progressAnnounce) {
                        progressAnnounce.textContent = `${itemTitle} נוסף לשקית ההפתעה שלכם. סה"כ פריטים: ${selectedItems.length}`;
                    }
                } else {
                    // Remove item
                    selectedItems.splice(index, 1);
                    card.classList.remove('in-bag');
                    card.querySelector('.btn-add-item').textContent = 'הוסף לשקית';

                    if (progressAnnounce) {
                        progressAnnounce.textContent = `${itemTitle} הוסר משקית ההפתעה שלכם. סה"כ פריטים: ${selectedItems.length}`;
                    }
                }

                updateBagBadgeList();
            };
            card.addEventListener('click', toggleItem);
            card.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleItem();
                }
            });
        });
        const updateBagBadgeList = () => {
            // Clear badges
            bagBadgeContainer.innerHTML = '';

            if (selectedItems.length === 0) {
                bagBadgeContainer.innerHTML = '<span class="text-muted" style="font-size:0.95rem;">השקית עדיין ריקה... לחצו על פריטים למעלה כדי למלא אותה! 🍭</span>';
                itemCountText.textContent = '0';
                checkoutBtn.disabled = true;
                return;
            }

            checkoutBtn.disabled = false;
            itemCountText.textContent = selectedItems.length;

            selectedItems.forEach(item => {
                const badge = document.createElement('span');
                badge.className = 'bag-badge-item';
                badge.innerHTML = `
          <span>${item.icon} ${item.title}</span>
          <button class="btn-remove-badge" data-item-id="${item.id}" aria-label="הסר ${item.title}">&times;</button>
        `;

                // Remove item event from badge
                badge.querySelector('.btn-remove-badge').addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop trigger card selection
                    const itemId = e.target.getAttribute('data-item-id');
                    // Find matching card and trigger click to remove it
                    const matchingCard = document.querySelector(`.item-add-card[data-item-id="${itemId}"]`);
                    if (matchingCard) {
                        matchingCard.click();
                    }
                });

                bagBadgeContainer.appendChild(badge);
            });
        };
        // Open Modal Checkout Summary
        const modal = document.getElementById('retro-checkout-modal');
        if (modal && checkoutBtn) {
            const closeModalBtn = modal.querySelector('.btn-close-retro');
            const checkoutList = document.getElementById('modal-checkout-list');
            const checkoutCount = document.getElementById('modal-checkout-count');
            const checkoutBagName = document.getElementById('modal-checkout-bag-name');
            checkoutBtn.addEventListener('click', () => {
                // Build checkout summary list
                checkoutList.innerHTML = '';
                selectedItems.forEach(item => {
                    const li = document.createElement('li');
                    li.style.padding = '8px 0';
                    li.style.borderBottom = '1px dashed #ddd';
                    li.style.fontWeight = 'bold';
                    li.style.fontSize = '1.1rem';
                    li.textContent = `${item.icon} ${item.title}`;
                    checkoutList.appendChild(li);
                });
                const bagLabelText = document.querySelector(`.bag-option-card[data-bag-type="${selectedBagType}"] h4`).textContent.trim();
                checkoutBagName.textContent = bagLabelText;
                checkoutCount.textContent = selectedItems.length;
                // Show Modal
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');

                // Focus first element inside modal for accessibility (WAI-ARIA)
                closeModalBtn.focus();

                if (progressAnnounce) {
                    progressAnnounce.textContent = "נפתח סיכום שקית ההפתעה בהתאמה אישית. השקית שלך מוכנה!";
                }
            });
            const closeModal = () => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                checkoutBtn.focus(); // Restore focus
            };
            closeModalBtn.addEventListener('click', closeModal);

            // Close on clicking overlay
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    closeModal();
                }
            });
        }
        // Initialize list
        updateBagBadgeList();
    }
    // ==========================================
    // 7. Contact Form Humorous Validation (Contact Page)
    // ==========================================
    const contactForm = document.getElementById('retro-contact-form');
    if (contactForm) {
        const progressAnnounce = document.getElementById('accessibility-announcer');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const birthInput = document.getElementById('contact-birthdate');
            const messageInput = document.getElementById('contact-message');

            // Basic accessibility checks
            if (!nameInput.value.trim() || !emailInput.value.trim() || !birthInput.value || !messageInput.value.trim()) {
                alert("אויש! נראה ששכחתם למלא כמה שדות הכרחיים. המורה אמא לא תהיה מרוצה! 📝");
                return;
            }

            // Extract birthday year
            const birthDate = new Date(birthInput.value);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthDate.getFullYear();

            let ageMessage = "";
            if (age < 18) {
                ageMessage = "רגע, אתם פחות מבני 18? איך הגעתם לפה?! לכו לשתות טרופית ותחזרו בעוד כמה שנים! 🍼😂";
            } else if (age >= 18 && age < 30) {
                ageMessage = "מצבכם מעולה, בגיל כזה עדיין אין כאבי גב רציניים. לכו לשחק ביר פונג! 🍻🎯";
            } else {
                ageMessage = `וואו, בן/בת ${age}! אתם רשמית זכאים לכאבי גב ומשכנתא מלווה ברגשות נוסטלגיה חזקים! 🩹👵`;
            }

            // Humorous Alert success
            alert(`הפרטים נשלחו בהצלחה! 🎉\n\n${ageMessage}\n\nתודה שפנית אלינו, אמא הרומניה שלנו כבר בודקת את המכתב שלך ומכינה לך תור לאורתופד ומארז טרופית! 💌`);

            if (progressAnnounce) {
                progressAnnounce.textContent = "הטופס נשלח בהצלחה והוצגה הודעת אישור הומוריסטית.";
            }

            contactForm.reset();
        });
    }
});
