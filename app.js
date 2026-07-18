/**
 * Lotus Medical Center - Core Application Scripts
 * 
 * Includes: Sticky Header, Mobile Drawer Navigation, Active Section Highlighting,
 * Scroll Reveal Animations, Interactive FAQ Accordion, WhatsApp Booking Form compiler,
 * and Hero Booking Widget connector.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. STICKY HEADER
    // ==========================================
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // ==========================================
    // 2. MOBILE DRAWER NAVIGATION
    // ==========================================
    const menuToggle = document.getElementById('menuToggle');
    const drawerClose = document.getElementById('drawerClose');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    menuToggle.addEventListener('click', openDrawer);
    drawerClose.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when a link is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });


    // ==========================================
    // 3. ACTIVE NAVIGATION LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('.id-target, #hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            // Adjust threshold offset to fit sticky header (approx 120px)
            if (window.scrollY >= (sectionTop - 120)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // ==========================================
    // 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => {
        revealOnScrollObserver.observe(element);
    });


    // ==========================================
    // 5. FAQ ACCORDION INTERACTIVITY
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        questionButton.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQs for true Accordion behavior
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
            }
        });
    });


    // ==========================================
    // 6. INTERACTIVE BOOKING MODAL & WHATSAPP
    // ==========================================
    const bookingModal = document.getElementById('bookingModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    
    // Form elements
    const bookingForm = document.getElementById('bookingForm');
    const formClinic = document.getElementById('formClinic');
    const formDoctorSelect = document.getElementById('formDoctor');
    const formPatientName = document.getElementById('formPatientName');
    const formPhone = document.getElementById('formPhone');
    const formDate = document.getElementById('formDate');
    const formTime = document.getElementById('formTime');
    const formNotes = document.getElementById('formNotes');

    // WhatsApp Direct Contact Number
    const CLINIC_WHATSAPP_NUMBER = '+967780856000';

    // Helper to populate modal and open it
    const openBookingForClinic = (clinicName, doctorListString, dateStr) => {
        // Check if emergency department
        if (clinicName === 'قسم الطوارئ') {
            const emergencyText = encodeURIComponent('حالة طوارئ عاجلة: أود التواصل مع قسم الطوارئ بمركز اللوتس الطبي فوراً.');
            window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER.replace('+', '')}?text=${emergencyText}`, '_blank');
            return;
        }

        // Setup form variables
        modalTitle.textContent = `حجز موعد - ${clinicName}`;
        formClinic.value = clinicName;
        
        // Clean and split doctor names
        formDoctorSelect.innerHTML = '';
        const doctors = doctorListString.split('،').map(d => d.trim());
        
        doctors.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc;
            option.textContent = doc;
            formDoctorSelect.appendChild(option);
        });
        
        // Set date
        if (dateStr) {
            formDate.value = dateStr;
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            formDate.value = tomorrow.toISOString().split('T')[0];
        }
        formDate.min = new Date().toISOString().split('T')[0];
        
        // Open Modal
        bookingModal.classList.add('open');
        modalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    // Handler to open booking modal via clinic card buttons
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clinicName = button.getAttribute('data-clinic');
            const doctorListString = button.getAttribute('data-doctors');
            openBookingForClinic(clinicName, doctorListString, null);
        });
    });

    // Close Modal handler
    const closeModal = () => {
        bookingModal.classList.remove('open');
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
        bookingForm.reset();
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Form Submission: Compile data and open WhatsApp
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const clinic = formClinic.value;
        const doctor = formDoctorSelect.value;
        const patientName = formPatientName.value;
        const phone = formPhone.value;
        const preferredDate = formDate.value;
        const preferredTime = formTime.value;
        const notes = formNotes.value.trim();
        
        // Structure the Arabic WhatsApp Message
        let message = `*طلب حجز موعد جديد في مركز اللوتس الطبي*\n`;
        message += `-----------------------------------------\n`;
        message += `🏥 *العيادة:* ${clinic}\n`;
        message += `🩺 *الطبيب المختص:* ${doctor}\n`;
        message += `👤 *اسم المريض:* ${patientName}\n`;
        message += `📞 *رقم الجوال:* ${phone}\n`;
        message += `📅 *تاريخ الزيارة:* ${preferredDate}\n`;
        message += `⏰ *الفترة المفضلة:* ${preferredTime}\n`;
        
        if (notes) {
            message += `📝 *ملاحظات طبية:* ${notes}\n`;
        }
        message += `-----------------------------------------\n`;
        message += `أرجو تأكيد موعد الحجز وتأكيده لي عبر هذا الرقم. شكراً لكم.`;
        
        const cleanPhoneNum = CLINIC_WHATSAPP_NUMBER.replace('+', '');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${cleanPhoneNum}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        closeModal();
    });


    // ==========================================
    // 7. HERO BOOKING WIDGET CONNECTOR
    // ==========================================
    const widgetClinicSelect = document.getElementById('widgetClinicSelect');
    const widgetDateInput = document.getElementById('widgetDateInput');
    const widgetBookBtn = document.getElementById('widgetBookBtn');

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (widgetDateInput) {
        widgetDateInput.value = tomorrow.toISOString().split('T')[0];
        widgetDateInput.min = new Date().toISOString().split('T')[0];
    }

    if (widgetBookBtn) {
        widgetBookBtn.addEventListener('click', () => {
            const selectedClinic = widgetClinicSelect.value;
            const selectedDate = widgetDateInput.value;

            // Map clinic to its doctor lists
            let doctorListString = "";
            if (selectedClinic === "عيادة طب الأسنان") {
                doctorListString = "د. شيماء الحداد، د. لمياء الحداد";
            } else if (selectedClinic === "عيادة النساء والولادة") {
                doctorListString = "د. فاتن العبسي";
            } else if (selectedClinic === "عيادة تنظيم الأسرة") {
                doctorListString = "د. إيحا العسلي";
            } else if (selectedClinic === "عيادة الأذن والأنف والحنجرة") {
                doctorListString = "الاستشاري د. منصور الذبحاني";
            } else if (selectedClinic === "قسم الطوارئ") {
                doctorListString = "د. عائشة الفقيه";
            }

            openBookingForClinic(selectedClinic, doctorListString, selectedDate);
        });
    }

    // ==========================================
    // 8. FORCE LIGHT THEME ONLY
    // ==========================================
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');

    // ==========================================
    // 9. DYNAMIC VISITOR COUNTER WITH BASELINE
    // ==========================================
    const visitCounterEl = document.getElementById('visitCounter');
    
    if (visitCounterEl) {
        const visitsBaseline = 1864; // Start baseline at 1864 so first visit equals 1865
        
        // Fallback Local Storage Counter (key updated to lotus_visits_v4 to clear old browser cache)
        let localVisits = parseInt(localStorage.getItem('lotus_visits_v4') || '0');
        localVisits += 1;
        localStorage.setItem('lotus_visits_v4', localVisits.toString());
        
        const initialDisplay = visitsBaseline + localVisits;
        visitCounterEl.textContent = initialDisplay.toLocaleString('ar-YE'); // Render initially with baseline + local count

        // Try to fetch global real count from CounterAPI (will work if online)
        // Project ID: lotus-medical-center-visits-production-v2 (fresh starting namespace)
        fetch('https://api.counterapi.dev/v1/projects/lotus-medical-center-visits-production-v2/counter/pageviews/increment')
            .then(res => res.json())
            .then(data => {
                if (data && data.value) {
                    const totalVisits = data.value;
                    const finalDisplay = visitsBaseline + totalVisits;
                    visitCounterEl.textContent = finalDisplay.toLocaleString('ar-YE');
                }
            })
            .catch(err => {
                console.log("CounterAPI not reachable, using localStorage fallback.", err);
            });
    }



});
