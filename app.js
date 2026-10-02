/**
 * CSS SEHRGARLARI — MAIN APP CONTROLLER & COORDINATOR
 * Manages view tabs, slide carousel navigation, keyboard events, audio toggling, and certificate export.
 */

class AppController {
  constructor() {
    this.currentSlideIndex = 0;
    this.totalSlides = 6;
    this.activeTab = 'slides'; // 'slides' or 'codelab'

    // DOM Elements
    this.tabSlides = document.getElementById('tabSlides');
    this.tabCodeLab = document.getElementById('tabCodeLab');
    this.slidesView = document.getElementById('slidesView');
    this.codeLabView = document.getElementById('codeLabView');
    
    this.slideCards = document.querySelectorAll('.slide-card');
    this.stepDots = document.querySelectorAll('.step-dot');
    this.progressBar = document.getElementById('slideProgressBar');
    this.slideIndicator = document.getElementById('slideIndicator');
    
    this.btnPrev = document.getElementById('btnPrevSlide');
    this.btnNext = document.getElementById('btnNextSlide');
    
    this.audioToggle = document.getElementById('audioToggle');
    this.audioIcon = document.getElementById('audioIcon');
    
    this.certBtn = document.getElementById('certBtn');
    this.certModal = document.getElementById('certModal');
    this.btnCloseCert = document.getElementById('btnCloseCert');
    this.btnPrintCert = document.getElementById('btnPrintCert');
    this.btnContinue = document.getElementById('btnContinueGame');
    this.certDate = document.getElementById('certDate');

    this.init();
  }

  init() {
    this.setupTabs();
    this.setupSlideNavigation();
    this.setupAudioControls();
    this.setupCertificateModal();
    this.setupKeyboardShortcuts();
    this.updateSlideView();
    this.initCertificateDate();
  }

  /* ------------------------------------------------------------------------
     TAB NAVIGATION (Slides vs Code Lab)
     ------------------------------------------------------------------------ */
  setupTabs() {
    if (this.tabSlides && this.tabCodeLab) {
      this.tabSlides.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.switchTab('slides');
      });

      this.tabCodeLab.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.switchTab('codelab');
      });
    }
  }

  switchTab(tab) {
    this.activeTab = tab;
    const isSlides = tab === 'slides';

    if (this.tabSlides) this.tabSlides.classList.toggle('active', isSlides);
    if (this.tabCodeLab) this.tabCodeLab.classList.toggle('active', !isSlides);

    if (this.slidesView) this.slidesView.classList.toggle('active', isSlides);
    if (this.codeLabView) this.codeLabView.classList.toggle('active', !isSlides);

    // Re-trigger layout or editor sync if moving to codelab
    if (!isSlides && window.codeLab) {
      window.codeLab.compileLive();
    }
  }

  /* ------------------------------------------------------------------------
     SLIDE CAROUSEL & STEPPER
     ------------------------------------------------------------------------ */
  setupSlideNavigation() {
    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.goToSlide(this.currentSlideIndex - 1);
      });
    }

    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        window.soundFx?.playClick();
        if (this.currentSlideIndex === this.totalSlides - 1) {
          // If on last slide, jump to code lab!
          this.switchTab('codelab');
        } else {
          this.goToSlide(this.currentSlideIndex + 1);
        }
      });
    }

    this.stepDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.goToSlide(index);
      });
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;
    this.currentSlideIndex = index;
    this.updateSlideView();
  }

  updateSlideView() {
    // Update Slide Cards
    this.slideCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === this.currentSlideIndex);
    });

    // Update Stepper Dots
    this.stepDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentSlideIndex);
      dot.classList.toggle('completed', idx < this.currentSlideIndex);
    });

    // Update Progress Bar
    if (this.progressBar) {
      const pct = ((this.currentSlideIndex + 1) / this.totalSlides) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    // Update Indicator Text
    if (this.slideIndicator) {
      this.slideIndicator.textContent = `${this.currentSlideIndex + 1} / ${this.totalSlides}`;
    }

    // Update Prev/Next Buttons
    if (this.btnPrev) {
      this.btnPrev.disabled = this.currentSlideIndex === 0;
    }

    if (this.btnNext) {
      if (this.currentSlideIndex === this.totalSlides - 1) {
        this.btnNext.innerHTML = '<span>Laboratoriya 🧪 ▶</span>';
      } else {
        this.btnNext.innerHTML = '<span>Keyingi ▶</span>';
      }
    }
  }

  /* ------------------------------------------------------------------------
     AUDIO & SFX CONTROLLER
     ------------------------------------------------------------------------ */
  setupAudioControls() {
    if (this.audioToggle && this.audioIcon) {
      this.audioToggle.addEventListener('click', () => {
        const isMuted = window.soundFx?.toggleMute();
        this.audioIcon.textContent = isMuted ? '🔇' : '🔊';
        this.audioToggle.title = isMuted ? "Ovoz: O'chirilgan" : "Ovoz: Yoqilgan";
      });
    }
  }

  /* ------------------------------------------------------------------------
     CERTIFICATE MODAL & PRINTING
     ------------------------------------------------------------------------ */
  setupCertificateModal() {
    const openCert = () => {
      window.soundFx?.playSuccess();
      if (this.certModal) this.certModal.removeAttribute('hidden');
    };

    const closeCert = () => {
      window.soundFx?.playClick();
      if (this.certModal) this.certModal.setAttribute('hidden', '');
    };

    if (this.certBtn) this.certBtn.addEventListener('click', openCert);
    if (this.btnCloseCert) this.btnCloseCert.addEventListener('click', closeCert);
    if (this.btnContinue) this.btnContinue.addEventListener('click', closeCert);

    if (this.btnPrintCert) {
      this.btnPrintCert.addEventListener('click', () => {
        window.soundFx?.playClick();
        window.print();
      });
    }
  }

  initCertificateDate() {
    if (this.certDate) {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      this.certDate.textContent = `Sana: ${now.toLocaleDateString('uz-UZ', options)}`;
    }
  }

  /* ------------------------------------------------------------------------
     KEYBOARD NAVIGATION
     ------------------------------------------------------------------------ */
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Avoid intercepting arrow keys if typing in code editor
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (this.activeTab === 'slides') {
          this.goToSlide(this.currentSlideIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.activeTab === 'slides') {
          this.goToSlide(this.currentSlideIndex - 1);
        }
      } else if (e.key === 'Escape') {
        if (this.certModal && !this.certModal.hasAttribute('hidden')) {
          this.certModal.setAttribute('hidden', '');
        }
      }
    });
  }
}

// Instantiate Controller on Load
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
