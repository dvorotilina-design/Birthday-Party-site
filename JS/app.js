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
    // Route selection elements
    const routeLazy = document.getElementById('route-lazy-card');
    const routeAdventurous = document.getElementById('route-adv-card');
    const sectionLazy = document.getElementById('section-lazy-ready');
    const sectionAdventurous = document.getElementById('section-adv-build');
    
    // Checkboxes inside route selection cards
    const checkRouteLazy = document.getElementById('check-route-lazy');
    const checkRouteAdv = document.getElementById('check-route-adv');
    
    // Checkboxes next to section headers
    const checkboxLazySection = document.getElementById('checkbox-lazy-section');
    const checkboxAdvSection = document.getElementById('checkbox-adv-section');
    
    if (routeLazy && routeAdventurous) {
        const progressAnnounce = document.getElementById('accessibility-announcer');

        const showRoute = (route) => {
            if (route === 'lazy') {
                sectionLazy.style.display = 'block';
                sectionAdventurous.style.display = 'none';
                
                routeLazy.classList.add('selected');
                routeAdventurous.classList.remove('selected');
                
                if (checkRouteLazy) checkRouteLazy.checked = true;
                if (checkRouteAdv) checkRouteAdv.checked = false;
                if (checkboxLazySection) checkboxLazySection.checked = true;
                if (checkboxAdvSection) checkboxAdvSection.checked = false;
                
                sectionLazy.scrollIntoView({ behavior: 'smooth' });
                if (progressAnnounce) progressAnnounce.textContent = "עברתם למסלול שקיות הפתעה מוכנות מראש.";
            } else {
                sectionLazy.style.display = 'none';
                sectionAdventurous.style.display = 'block';
                
                routeLazy.classList.remove('selected');
                routeAdventurous.classList.add('selected');
                
                if (checkRouteLazy) checkRouteLazy.checked = false;
                if (checkRouteAdv) checkRouteAdv.checked = true;
                if (checkboxLazySection) checkboxLazySection.checked = false;
                if (checkboxAdvSection) checkboxAdvSection.checked = true;
                
                sectionAdventurous.scrollIntoView({ behavior: 'smooth' });
                if (progressAnnounce) progressAnnounce.textContent = "עברתם למסלול הרכבה עצמית אינטראקטיבית של שקית הפתעה.";
            }
        };

        // Click handlers for Route Selection Cards
        routeLazy.addEventListener('click', () => showRoute('lazy'));
        routeAdventurous.addEventListener('click', () => showRoute('adv'));
        
        // Handle keypress (Space/Enter) on Route Selection Cards
        const handleKeySelect = (e, route) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                showRoute(route);
            }
        };
        routeLazy.addEventListener('keydown', (e) => handleKeySelect(e, 'lazy'));
        routeAdventurous.addEventListener('keydown', (e) => handleKeySelect(e, 'adv'));

        // Handle clicks on the section header checkboxes
        if (checkboxLazySection) {
            checkboxLazySection.addEventListener('change', (e) => {
                if (e.target.checked) {
                    showRoute('lazy');
                } else {
                    showRoute('adv');
                }
            });
        }
        if (checkboxAdvSection) {
            checkboxAdvSection.addEventListener('change', (e) => {
                if (e.target.checked) {
                    showRoute('adv');
                } else {
                    showRoute('lazy');
                }
            });
        }
    }

    // Modal elements
    const modal = document.getElementById('retro-checkout-modal');
    
    // Fireworks celebration function using Canvas Confetti
    const triggerConfettiCelebration = () => {
        if (typeof confetti === 'function') {
            const duration = 4 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 11000 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                // firework bursts from left and right sides
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    };

    // Route A: Let's Go buttons logic
    const lazyGoButtons = document.querySelectorAll('.btn-lazy-go');
    if (lazyGoButtons.length > 0 && modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalBagImg = document.getElementById('modal-checkout-bag-img');
        const modalBagName = document.getElementById('modal-checkout-bag-name');
        const modalCount = document.getElementById('modal-checkout-count');
        const modalList = document.getElementById('modal-checkout-list');
        const closeModalBtn = modal.querySelector('.btn-close-retro');

        lazyGoButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const bagName = btn.getAttribute('data-bag-name');
                const bagImg = btn.getAttribute('data-bag-img');
                const bagItemsStr = btn.getAttribute('data-bag-items');
                const itemsList = bagItemsStr.split(', ');

                // Update Modal Content
                if (modalTitle) modalTitle.textContent = `🎉 השקית שלכם מוכנה: ${bagName}!`;
                if (modalBagImg) modalBagImg.setAttribute('src', bagImg);
                if (modalBagName) modalBagName.textContent = bagName;
                if (modalCount) modalCount.textContent = itemsList.length.toString();

                if (modalList) {
                    modalList.innerHTML = '';
                    itemsList.forEach(item => {
                        const li = document.createElement('li');
                        li.style.padding = '8px 0';
                        li.style.borderBottom = '1px dashed #ddd';
                        li.style.fontWeight = 'bold';
                        li.style.fontSize = '1.1rem';
                        li.textContent = `🎁 ${item}`;
                        modalList.appendChild(li);
                    });
                }

                // Open Modal
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                if (closeModalBtn) closeModalBtn.focus();

                // Trigger Fireworks Celebration!
                triggerConfettiCelebration();
            });
        });
    }

    // Route B: Custom Bag Builder Logic
    const emptyBagCards = document.querySelectorAll('.bag-empty-card');
    let selectedBagType = 'kraft';
    let selectedBagName = 'שקית נייר קראפט 🤎';
    let selectedBagImg = 'Images birthday site/surprise_bag_empty.png';
    let selectedItems = [];

    if (emptyBagCards.length > 0) {
        const progressAnnounce = document.getElementById('accessibility-announcer');

        emptyBagCards.forEach(card => {
            card.setAttribute('tabindex', '0');

            const selectBag = () => {
                emptyBagCards.forEach(c => {
                    c.classList.remove('selected');
                    c.setAttribute('aria-checked', 'false');
                });
                card.classList.add('selected');
                card.setAttribute('aria-checked', 'true');

                selectedBagType = card.getAttribute('data-bag-type');
                selectedBagName = card.getAttribute('data-bag-name');
                selectedBagImg = card.getAttribute('data-bag-img');

                if (progressAnnounce) {
                    progressAnnounce.textContent = `בחרת בשקית ריקה סוג: ${selectedBagName}.`;
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
    }

    // Item selection logic
    const itemWhiteCards = document.querySelectorAll('.item-white-card');
    const checkoutBtn = document.getElementById('checkout-bag-btn');

    if (itemWhiteCards.length > 0 && checkoutBtn) {
        const progressAnnounce = document.getElementById('accessibility-announcer');

        itemWhiteCards.forEach(card => {
            card.setAttribute('tabindex', '0');

            const toggleItem = () => {
                const itemId = card.getAttribute('data-item-id');
                const itemName = card.getAttribute('data-item-name');
                const itemEmoji = card.getAttribute('data-item-emoji');

                const index = selectedItems.findIndex(i => i.id === itemId);

                if (index === -1) {
                    // Add item
                    selectedItems.push({ id: itemId, name: itemName, emoji: itemEmoji });
                    card.classList.add('selected');
                    if (progressAnnounce) {
                        progressAnnounce.textContent = `${itemName} נוסף לשקית ההפתעה שלכם. סה"כ פריטים: ${selectedItems.length}`;
                    }
                } else {
                    // Remove item
                    selectedItems.splice(index, 1);
                    card.classList.remove('selected');
                    if (progressAnnounce) {
                        progressAnnounce.textContent = `${itemName} הוסר משקית ההפתעה שלכם. סה"כ פריטים: ${selectedItems.length}`;
                    }
                }

                // Enable/Disable checkout button
                checkoutBtn.disabled = selectedItems.length === 0;
            };

            card.addEventListener('click', toggleItem);
            card.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    toggleItem();
                }
            });
        });

        // Checkout button click handler for Custom Bag
        if (modal) {
            const modalTitle = document.getElementById('modal-title');
            const modalBagImg = document.getElementById('modal-checkout-bag-img');
            const modalBagName = document.getElementById('modal-checkout-bag-name');
            const modalCount = document.getElementById('modal-checkout-count');
            const modalList = document.getElementById('modal-checkout-list');
            const closeModalBtn = modal.querySelector('.btn-close-retro');

            checkoutBtn.addEventListener('click', () => {
                // Update Modal Content
                if (modalTitle) modalTitle.textContent = `🎉 השקית המותאמת שלכם מוכנה!`;
                if (modalBagImg) modalBagImg.setAttribute('src', selectedBagImg);
                if (modalBagName) modalBagName.textContent = selectedBagName;
                if (modalCount) modalCount.textContent = selectedItems.length.toString();

                if (modalList) {
                    modalList.innerHTML = '';
                    selectedItems.forEach(item => {
                        const li = document.createElement('li');
                        li.style.padding = '8px 0';
                        li.style.borderBottom = '1px dashed #ddd';
                        li.style.fontWeight = 'bold';
                        li.style.fontSize = '1.1rem';
                        li.textContent = `🎁 ${item.emoji} ${item.name}`;
                        modalList.appendChild(li);
                    });
                }

                // Open Modal
                modal.style.display = 'flex';
                modal.setAttribute('aria-hidden', 'false');
                if (closeModalBtn) closeModalBtn.focus();

                // Trigger Fireworks Celebration!
                triggerConfettiCelebration();
            });

            // Close Modal logic
            const closeModal = () => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
                checkoutBtn.focus();
            };

            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', closeModal);
            }
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    closeModal();
                }
            });
        }
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
