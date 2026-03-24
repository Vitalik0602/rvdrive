const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-1002816551291'; // Замените на актуальный CHAT_ID супергруппы
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Sound effect for successful form submission
const messageSentSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3'); // Public domain "message sent" sound

document.addEventListener('DOMContentLoaded', () => {
    // Мобильное меню
const menuToggles = document.querySelectorAll('.menu-toggle');
const nav = document.querySelector('nav');
if (menuToggles.length && nav) {
    menuToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('active');
            menuToggles.forEach(b => {
                b.setAttribute('aria-expanded', isOpen);
                b.textContent = isOpen ? '✕' : '☰';
            });
        });
    });

    // Закрытие по клику вне меню
    document.addEventListener('click', (e) => {
        const inNav = nav.contains(e.target);
        const inBtn = [...menuToggles].some(b => b.contains(e.target));
        if (!inNav && !inBtn && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggles.forEach(b => {
                b.setAttribute('aria-expanded', false);
                b.textContent = '☰';
            });
        }
    });
}

    // Динамическое заполнение списка автомобилей на index.html
    const carSelect = document.getElementById('car');
    if (carSelect) {
        const cars = document.querySelectorAll('.cars-grid .car-item h3');
        carSelect.innerHTML = '<option value="">-- Выберите автомобиль --</option>';
        cars.forEach(car => {
            const option = document.createElement('option');
            option.value = car.textContent;
            option.textContent = car.textContent;
            carSelect.appendChild(option);
        });
    }

    // Скрытие/показ полей формы на index.html
    const requestTypeSelect = document.getElementById('requestType');
    if (requestTypeSelect) {

        // Вспомогательная функция: удаляет динамически добавленные поля
        function removeDynamicFields() {
            ['budget', 'desiredCar', 'svcCarModel', 'svcYear', 'svcProblem', 'svcDate'].forEach(id => {
                const label = document.querySelector(`label[for="${id}"]`);
                const input = document.getElementById(id);
                if (label) label.remove();
                if (input) input.remove();
            });
        }

        // Вспомогательная функция: создаёт label + input/textarea/select перед fullNameLabel
        function addField(type, id, labelText, options = null, placeholder = '') {
            const fullNameLabel = document.querySelector('label[for="fullName"]');
            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.textContent = labelText;

            let el;
            if (type === 'select') {
                el = document.createElement('select');
                el.id = id;
                el.required = true;
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.textContent = '-- Выберите --';
                el.appendChild(defaultOpt);
                options.forEach(([val, txt]) => {
                    const opt = document.createElement('option');
                    opt.value = val;
                    opt.textContent = txt;
                    el.appendChild(opt);
                });
            } else if (type === 'textarea') {
                el = document.createElement('textarea');
                el.id = id;
                el.placeholder = placeholder;
                el.rows = 3;
            } else {
                el = document.createElement(type === 'date' ? 'input' : 'input');
                el.type = type;
                el.id = id;
                el.placeholder = placeholder;
                if (type !== 'date') el.required = true;
            }

            inspectionForm.insertBefore(label, fullNameLabel);
            inspectionForm.insertBefore(el, fullNameLabel);
        }

        requestTypeSelect.addEventListener('change', function () {
            const uploadField = document.getElementById('uploadField');
            const carSelect = document.getElementById('car');
            const photoField = document.getElementById('photo');

            // Сбрасываем всё
            removeDynamicFields();
            carSelect.disabled = false;
            carSelect.closest('label') && (carSelect.closest('label').style.display = '');
            uploadField.style.display = 'none';
            photoField.disabled = false;

            // Показываем/скрываем select авто
            const carLabel = document.querySelector('label[for="car"]');
            if (carLabel) carLabel.style.display = '';
            carSelect.style.display = '';

            if (this.value === 'Комиссия' || this.value === 'Автоломбард') {
                carSelect.disabled = true;
                uploadField.style.display = 'block';

            } else if (this.value === 'Автоподбор') {
                addField('text', 'budget', 'Бюджет:', null, 'Например: до 1 500 000 ₽');
                addField('text', 'desiredCar', 'Желаемая машина:', null, 'Например: Toyota Camry 2018+');
                carSelect.disabled = true;
                uploadField.style.display = 'none';

            } else if (this.value === 'Автосервис') {
                // Скрываем select авто из каталога — он не нужен для сервиса
                if (carLabel) carLabel.style.display = 'none';
                carSelect.style.display = 'none';
                carSelect.disabled = true;

                // Марка и модель
                addField('text', 'svcCarModel', 'Марка и модель автомобиля:', null, 'Например: Mercedes C200 2017');

                // Тип работы
                addField('select', 'svcProblem', 'Тип услуги:', [
                    ['Диагностика', '🔍 Компьютерная диагностика'],
                    ['ТО', '🔧 Техническое обслуживание (ТО)'],
                    ['Замена масла', '🛢 Замена масла и фильтров'],
                    ['Двигатель', '⚙️ Ремонт двигателя'],
                    ['Ходовая', '🚗 Ходовая часть'],
                    ['Тормоза', '🛑 Тормозная система'],
                    ['Электрика', '⚡ Электрика и электроника'],
                    ['Кузов', '🔨 Кузовной ремонт'],
                    ['Шиномонтаж', '🔄 Шиномонтаж и балансировка'],
                    ['Кондиционер', '❄️ Кондиционер / климат'],
                    ['Детейлинг', '✨ Детейлинг и химчистка'],
                    ['Предпродажная', '📋 Предпродажная подготовка'],
                    ['Другое', '💬 Другое (опишу в комментарии)'],
                ]);

                // Желаемая дата
                addField('date', 'svcDate', 'Желаемая дата визита:');
                // Ставим минимальную дату = сегодня
                const svcDateInput = document.getElementById('svcDate');
                if (svcDateInput) {
                    const today = new Date().toISOString().split('T')[0];
                    svcDateInput.min = today;
                }

                // Комментарий
                addField('textarea', 'svcYear', 'Комментарий / описание проблемы:', null, 'Опишите симптомы или уточните детали...');
            }
        });
    }

    // Обработка формы на index.html
    const inspectionForm = document.getElementById('inspectionForm');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Отправка...';

            const requestType = document.getElementById('requestType').value;
            const car = document.getElementById('car').value;
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const photoFile = document.getElementById('photo').files[0];
            const budget = document.getElementById('budget') ? document.getElementById('budget').value : '';
            const desiredCar = document.getElementById('desiredCar') ? document.getElementById('desiredCar').value : '';

            // Поля автосервиса
            const svcCarModel = document.getElementById('svcCarModel') ? document.getElementById('svcCarModel').value : '';
            const svcProblem  = document.getElementById('svcProblem')  ? document.getElementById('svcProblem').value  : '';
            const svcDate     = document.getElementById('svcDate')     ? document.getElementById('svcDate').value     : '';
            const svcComment  = document.getElementById('svcYear')     ? document.getElementById('svcYear').value     : ''; // id=svcYear использован для поля комментария

            // Проверка обязательных полей
            if (requestType === 'Автоподбор') {
                if (!budget || !desiredCar || !fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                    return;
                }
            } else if (requestType === 'Комиссия' || requestType === 'Автоломбард') {
                if (!fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля (ФИО и телефон).';
                    return;
                }
            } else if (requestType === 'Автосервис') {
                if (!svcCarModel || !svcProblem || !fullName || !phone) {
                    formMessage.textContent = '❌ Укажите автомобиль, тип услуги, ФИО и телефон.';
                    return;
                }
            } else {
                if (!car || !fullName || !phone) {
                    formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                    return;
                }
            }

            // Формируем сообщение
            let message;
            if (requestType === 'Автосервис') {
                message = `
🔧 *Запись в автосервис rvDrive*
Услуга: ${svcProblem}
Автомобиль: ${svcCarModel}
Желаемая дата: ${svcDate ? svcDate : 'не указана'}
ФИО: ${fullName}
Телефон: ${phone}${svcComment ? '\nКомментарий: ' + svcComment : ''}
                `;
            } else {
                message = `
🚗 *Новая заявка с сайта*  
Тип: ${requestType}  
${requestType === 'Автоподбор' ? `Бюджет: ${budget}  \nЖелаемая машина: ${desiredCar}` : (car ? `Авто: ${car}` : 'Авто: не выбрано')}  
ФИО: ${fullName}  
Телефон: ${phone}
                `;
            }

            if (photoFile && (requestType === 'Комиссия' || requestType === 'Автоломбард')) {
                const formData = new FormData();
                formData.append('chat_id', CHAT_ID);
                formData.append('photo', photoFile);
                formData.append('caption', message);
                formData.append('parse_mode', 'Markdown');

                fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.ok) {
                            formMessage.textContent = '✅ Заявка отправлена!';
                            this.reset();
                            document.getElementById('uploadField').style.display = 'none';
                            document.getElementById('car').disabled = false;
                            const carLabel3 = document.querySelector('label[for="car"]');
                            if (carLabel3) carLabel3.style.display = '';
                            document.getElementById('car').style.display = '';
                            ['budget','desiredCar','svcCarModel','svcProblem','svcDate','svcYear'].forEach(id => {
                                const lbl = document.querySelector(`label[for="${id}"]`);
                                const el  = document.getElementById(id);
                                if (lbl) lbl.remove();
                                if (el)  el.remove();
                            });
                            messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        } else {
                            formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                        }
                    })
                    .catch(error => {
                        formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                        console.error('Ошибка отправки:', error);
                    });
            } else {
                fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.ok) {
                            formMessage.textContent = '✅ Заявка отправлена!';
                            this.reset();
                            document.getElementById('uploadField').style.display = 'none';
                            document.getElementById('car').disabled = false;
                            const carLabel2 = document.querySelector('label[for="car"]');
                            if (carLabel2) carLabel2.style.display = '';
                            document.getElementById('car').style.display = '';
                            ['budget','desiredCar','svcCarModel','svcProblem','svcDate','svcYear'].forEach(id => {
                                const lbl = document.querySelector(`label[for="${id}"]`);
                                const el  = document.getElementById(id);
                                if (lbl) lbl.remove();
                                if (el)  el.remove();
                            });
                            messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        } else {
                            formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                        }
                    })
                    .catch(error => {
                        formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                        console.error('Ошибка отправки:', error);
                    });
            }
        });
    }

    // Обработка формы на model*.html
    const carInquiryForm = document.getElementById('carInquiryForm');
    if (carInquiryForm) {
        carInquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Отправка...';

            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const messageText = document.getElementById('message').value;
            const carModel = document.querySelector('h1').textContent;

            // Проверка обязательных полей
            if (!fullName || !phone) {
                formMessage.textContent = '❌ Пожалуйста, заполните все обязательные поля.';
                return;
            }

            // Формируем сообщение
            const message = `
🚗 *Заявка на автомобиль*  
Модель: ${carModel}  
ФИО: ${fullName}  
Телефон: ${phone}  
${messageText ? `Сообщение: ${messageText}` : ''}
            `;

            fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.ok) {
                        formMessage.textContent = '✅ Заявка отправлена!';
                        this.reset();
                        messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                    } else {
                        formMessage.textContent = `❌ Ошибка отправки: ${result.description || 'Неизвестная ошибка'}`;
                    }
                })
                .catch(error => {
                    formMessage.textContent = `❌ Ошибка отправки: ${error.message}`;
                    console.error('Ошибка отправки:', error);
                });
        });
    }

    // Слайдер и модальное окно
    const carSlider = document.querySelector('.car-slider');
    if (carSlider) {
        const slides = document.querySelectorAll('.car-slide');
        const thumbnails = document.querySelectorAll('.car-slider-thumbnails .thumbnail');
        const indicators = document.querySelectorAll('.car-slider-indicators .indicator');
        const prevCar = document.getElementById('prevCar');
        const nextCar = document.getElementById('nextCar');
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.querySelector('.modal-close');
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        let currentIndex = 0;
        let autoSlideInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        // Ensure modal is hidden on initialization
        if (modal) {
            modal.style.display = 'none'; // Гарантируем, что модальное окно скрыто при загрузке
        }

        const updateSlider = (index) => {
            if (index >= 0 && index < slides.length) {
                carSlider.style.transform = `translateX(-${index * 100}%)`;
                slides.forEach((slide, i) => {
                    slide.setAttribute('aria-current', i === index ? 'true' : 'false');
                });
                indicators.forEach((indicator, i) => {
                    indicator.classList.toggle('active', i === index);
                });
                thumbnails.forEach((thumbnail, i) => {
                    thumbnail.classList.toggle('active', i === index);
                });
                currentIndex = index;
            }
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider(currentIndex);
            }, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Инициализация слайдера только после полной загрузки DOM
        if (slides.length > 0) {
            updateSlider(0); // Устанавливаем первый слайд
            startAutoSlide(); // Запускаем автопрокрутку
        }

        // Обработчики событий только для кликов пользователя
        if (prevCar) prevCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        if (nextCar) nextCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        if (thumbnails.length > 0) thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                stopAutoSlide();
                updateSlider(index);
                startAutoSlide();
            });
        });

        if (indicators.length > 0) indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoSlide();
                updateSlider(index);
                startAutoSlide();
            });
        });

        if (slides.length > 0) slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                // Проверяем, что клик был именно по изображению, а не по слайду
                const img = slide.querySelector('img');
                if (e.target === img) {
                    stopAutoSlide();
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.style.display = 'flex';
                    modal.focus();
                    currentIndex = index;
                }
            });
        });

        if (modalClose) modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            startAutoSlide();
            if (prevCar) prevCar.focus();
        });

        if (modalPrev) modalPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        if (modalNext) modalNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        // Обработка touch-событий для слайдера
        if (carSlider) {
            carSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            });

            carSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateSlider(currentIndex);
                } else if (touchEndX - touchStartX > 50) {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    updateSlider(currentIndex);
                }
                startAutoSlide();
            });
        }

        // Обработка клавиш
        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    if (modalPrev) modalPrev.click();
                } else if (e.key === 'ArrowRight') {
                    if (modalNext) modalNext.click();
                } else if (e.key === 'Escape') {
                    if (modalClose) modalClose.click();
                }
            }
        });

        // Закрытие модального окна при клике вне изображения
        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modalClose) modalClose.click();
            }
        });

        // Остановка автопрокрутки при взаимодействии
        if (carSlider) {
            carSlider.addEventListener('mouseenter', stopAutoSlide);
            carSlider.addEventListener('mouseleave', startAutoSlide);
        }
    }
});
    // ── Фильтр автомобилей ──
    const filterBtns = document.querySelectorAll('.filter-btn');
    const carItems   = document.querySelectorAll('.car-item');
    const noResults  = document.getElementById('carsNoResults');

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const f = btn.dataset.filter;
                let visible = 0;
                carItems.forEach(item => {
                    const tags  = item.dataset.tags || '';
                    const price = parseInt(item.dataset.price, 10);
                    let show = false;
                    if (f === 'all')     show = true;
                    else if (f === 'budget')  show = price < 1000000;
                    else if (f === 'mid')     show = price >= 1000000 && price <= 3000000;
                    else if (f === 'premium') show = price > 3000000;
                    else if (f === 'rent')    show = tags.includes('rent');
                    item.style.display = show ? '' : 'none';
                    if (show) visible++;
                });
                if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
            });
        });
    }

    // ── Анимирующиеся счётчики в hero ──
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    if (statNums.length) {
        const animateCounter = (el) => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1600;
            const step = 16;
            const increment = target / (duration / step);
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) { current = target; clearInterval(timer); }
                el.textContent = Math.floor(current);
            }, step);
        };
        const heroObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNums.forEach(animateCounter);
                    heroObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) heroObserver.observe(heroStats);
    }

    // ── AOS (Animate On Scroll) ──
    const aosItems = document.querySelectorAll('[data-aos]');
    if (aosItems.length) {
        const aosObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-visible');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        aosItems.forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 80 + 'ms';
            aosObserver.observe(el);
        });
    }

    // ── Scroll-to-top button ──
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── Active nav link on scroll ──
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    if (navLinks.length) {
        const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
        window.addEventListener('scroll', () => {
            const pos = window.scrollY + 100;
            sections.forEach((sec, i) => {
                if (sec.offsetTop <= pos && sec.offsetTop + sec.offsetHeight > pos) {
                    navLinks.forEach(l => l.classList.remove('nav-active'));
                    navLinks[i].classList.add('nav-active');
                }
            });
        }, { passive: true });
    }
