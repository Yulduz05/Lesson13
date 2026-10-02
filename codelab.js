/**
 * CSS SEHRGARLARI — IN-BROWSER CODE COMPILER & MISSIONS MODULE
 * Provides live CSS compilation, smart code chips, mission validation, and gamified celebrations.
 */

const MISSIONS = [
  {
    id: 1,
    title: "1-Missiya: Raketani 20% kattalashtiring!",
    desc: "Raketaga sichqoncha tekkanda <code>transform: scale(1.2);</code> xususiyatini qo'shing.",
    initialCode: `.lab-raketa {\n  /* Raketa asosiy uslubi */\n}\n\n.lab-raketa:hover {\n  /* Sichqoncha tekkanda */\n  transform: scale(1.2);\n}`,
    smartBlocks: [
      { label: "transform: scale(1.2);", code: "  transform: scale(1.2);\n" },
      { label: "transform: scale(1.5);", code: "  transform: scale(1.5);\n" },
      { label: "opacity: 0.8;", code: "  opacity: 0.8;\n" }
    ],
    hint: "Sichqoncha tekkanda (.lab-raketa:hover) qatoriga transform: scale(1.2); yozing!",
    validate: (css) => {
      const clean = css.replace(/\s+/g, ' ').toLowerCase();
      const hasHover = clean.includes(':hover');
      const hasScale = clean.includes('scale(1.2') || clean.includes('scale(1.20') || clean.includes('scale(1.25');
      return hasHover && hasScale;
    }
  },
  {
    id: 2,
    title: "2-Missiya: Harakatni silliqlashtiring (0.5s)!",
    desc: "Raketaning sakramasdan silliq harakatlanishi uchun <code>transition: 0.5s;</code> qo'shing.",
    initialCode: `.lab-raketa {\n  /* Silliq harakat beramiz */\n  transition: 0.5s;\n}\n\n.lab-raketa:hover {\n  transform: scale(1.2);\n}`,
    smartBlocks: [
      { label: "transition: 0.5s;", code: "  transition: 0.5s;\n" },
      { label: "transition: 0.8s ease-in-out;", code: "  transition: 0.8s ease-in-out;\n" },
      { label: "transition: 1s;", code: "  transition: 1s;\n" }
    ],
    hint: ".lab-raketa blokiga transition: 0.5s; qo'shing!",
    validate: (css) => {
      const clean = css.replace(/\s+/g, ' ').toLowerCase();
      return clean.includes('transition:') && (clean.includes('0.5s') || clean.includes('0.5') || clean.includes('500ms'));
    }
  },
  {
    id: 3,
    title: "3-Missiya: Olovli plazma nuri (box-shadow)!",
    desc: "Raketa uchishida yorqin nur sochishi uchun <code>box-shadow: 0 10px 30px #f97316;</code> qo'shing.",
    initialCode: `.lab-raketa {\n  transition: 0.5s;\n}\n\n.lab-raketa:hover {\n  transform: scale(1.2);\n  /* Yorqin nur sochsin */\n  box-shadow: 0 10px 30px #f97316;\n}`,
    smartBlocks: [
      { label: "box-shadow: 0 10px 30px #f97316;", code: "  box-shadow: 0 10px 30px #f97316;\n" },
      { label: "box-shadow: 0 15px 40px #38bdf8;", code: "  box-shadow: 0 15px 40px #38bdf8;\n" },
      { label: "box-shadow: 0 10px 20px #a855f7;", code: "  box-shadow: 0 10px 20px #a855f7;\n" }
    ],
    hint: ".lab-raketa:hover ichiga box-shadow yozing va nuqtali vergul (;)ni unutmang!",
    validate: (css) => {
      const clean = css.replace(/\s+/g, ' ').toLowerCase();
      return clean.includes('box-shadow:') && (clean.includes('px') || clean.includes('#') || clean.includes('rgb'));
    }
  },
  {
    id: 4,
    title: "4-Missiya: Super Sinov — Master Sehrgarlik!",
    desc: "Barcha xususiyatlarni birlashtiring: transition, scale va box-shadow!",
    initialCode: `.lab-raketa {\n  transition: all 0.4s ease;\n}\n\n.lab-raketa:hover {\n  transform: scale(1.25) translateY(-15px);\n  box-shadow: 0 20px 45px #f59e0b;\n}`,
    smartBlocks: [
      { label: "transform: scale(1.25) translateY(-15px);", code: "  transform: scale(1.25) translateY(-15px);\n" },
      { label: "box-shadow: 0 20px 45px #f59e0b;", code: "  box-shadow: 0 20px 45px #f59e0b;\n" },
      { label: "transition: all 0.4s ease;", code: "  transition: all 0.4s ease;\n" }
    ],
    hint: "Barcha xususiyatlar to'liq va xatosiz yozilganiga ishonch hosil qiling!",
    validate: (css) => {
      const clean = css.replace(/\s+/g, ' ').toLowerCase();
      return clean.includes('transition') && clean.includes('scale') && clean.includes('box-shadow');
    }
  }
];

class CodeLab {
  constructor() {
    this.currentMissionIndex = 0;
    this.completedMissions = new Set();
    this.styleElement = null;

    this.editor = document.getElementById('cssEditor');
    this.consoleMsg = document.getElementById('consoleMsg');
    this.consoleStatus = document.getElementById('consoleStatus');
    this.smartBlocksContainer = document.getElementById('smartBlocks');
    this.bannerTitle = document.getElementById('bannerTitle');
    this.bannerDesc = document.getElementById('bannerDesc');
    this.missionCards = document.querySelectorAll('.mission-card');
    this.missionBadge = document.getElementById('missionBadge');
    this.actor = document.getElementById('labRocketActor');

    this.metricTransform = document.getElementById('metricTransform');
    this.metricTransition = document.getElementById('metricTransition');
    this.metricShadow = document.getElementById('metricShadow');

    this.init();
  }

  init() {
    // Create dynamic style tag for live compilation
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'dynamic-codelab-styles';
    document.head.appendChild(this.styleElement);

    // Event Listeners
    if (this.editor) {
      this.editor.addEventListener('input', () => this.compileLive());
      this.editor.addEventListener('keydown', (e) => this.handleEditorKeydown(e));
    }

    const btnVerify = document.getElementById('btnVerifyMission');
    if (btnVerify) {
      btnVerify.addEventListener('click', () => this.verifyCurrentMission());
    }

    const btnReset = document.getElementById('btnResetCode');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.loadMission(this.currentMissionIndex);
      });
    }

    this.missionCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        window.soundFx?.playClick();
        this.loadMission(idx);
      });
    });

    // Actor live hover sounds & computed metrics check
    if (this.actor) {
      this.actor.addEventListener('mouseenter', () => {
        window.soundFx?.playHover();
        setTimeout(() => this.updateComputedMetrics(), 50);
      });
      this.actor.addEventListener('mouseleave', () => {
        setTimeout(() => this.updateComputedMetrics(), 100);
      });
    }

    // Load first mission
    this.loadMission(0);
  }

  loadMission(index) {
    this.currentMissionIndex = index;
    const mission = MISSIONS[index];
    if (!mission) return;

    // Update Mission Banner
    if (this.bannerTitle) this.bannerTitle.textContent = mission.title;
    if (this.bannerDesc) this.bannerDesc.innerHTML = mission.desc;

    // Update Sidebar active state
    this.missionCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === index);
    });

    // Populate Editor
    if (this.editor) {
      this.editor.value = mission.initialCode;
      this.compileLive();
    }

    // Populate Smart Blocks Shelf
    if (this.smartBlocksContainer) {
      this.smartBlocksContainer.innerHTML = '';
      mission.smartBlocks.forEach(block => {
        const chip = document.createElement('button');
        chip.className = 'smart-block-chip';
        chip.textContent = block.label;
        chip.addEventListener('click', () => {
          window.soundFx?.playClick();
          this.insertSnippet(block.code);
        });
        this.smartBlocksContainer.appendChild(chip);
      });
    }

    // Reset console message
    this.setConsoleStatus('💡 Kodni yozing yoki tezkor bloklarni bosing va natijani sinab ko\'ring!', 'normal');
  }

  insertSnippet(text) {
    if (!this.editor) return;
    const start = this.editor.selectionStart;
    const end = this.editor.selectionEnd;
    const val = this.editor.value;

    this.editor.value = val.substring(0, start) + text + val.substring(end);
    this.editor.selectionStart = this.editor.selectionEnd = start + text.length;
    this.editor.focus();
    this.compileLive();
  }

  handleEditorKeydown(e) {
    // Handle tab key nicely
    if (e.key === 'Tab') {
      e.preventDefault();
      this.insertSnippet('  ');
    }
  }

  compileLive() {
    if (!this.editor || !this.styleElement) return;
    const userCss = this.editor.value;

    // Replace class name to target only the live rocket actor
    const scopedCss = userCss
      .replace(/\.lab-raketa:hover/g, '#labRocketActor:hover, #labRocketActor.simulated-hover')
      .replace(/\.lab-raketa/g, '#labRocketActor');

    this.styleElement.textContent = scopedCss;
    this.updateComputedMetrics();
  }

  updateComputedMetrics() {
    if (!this.actor) return;
    const computed = window.getComputedStyle(this.actor);

    if (this.metricTransform) {
      const tr = computed.transform;
      this.metricTransform.textContent = tr === 'none' ? 'none' : 'Faol ⚡';
    }
    if (this.metricTransition) {
      const dur = computed.transitionDuration;
      this.metricTransition.textContent = dur || '0s';
    }
    if (this.metricShadow) {
      const sh = computed.boxShadow;
      this.metricShadow.textContent = sh === 'none' ? 'none' : 'Nur sochmoqda ✨';
    }
  }

  verifyCurrentMission() {
    const mission = MISSIONS[this.currentMissionIndex];
    if (!mission || !this.editor) return;

    const code = this.editor.value;
    const isValid = mission.validate(code);

    if (isValid) {
      window.soundFx?.playSuccess();
      this.setConsoleStatus('🎉 Barakalla! Missiya muvaffaqiyatli bajarildi!', 'success');
      
      // Mark mission completed
      this.completedMissions.add(this.currentMissionIndex);
      this.updateMissionUI();

      // Trigger celebratory confetti
      this.celebrateSuccess();

      // Check if all missions complete
      if (this.completedMissions.size === MISSIONS.length) {
        setTimeout(() => {
          const certModal = document.getElementById('certModal');
          if (certModal) certModal.removeAttribute('hidden');
        }, 1500);
      } else {
        // Offer next mission after delay
        if (this.currentMissionIndex < MISSIONS.length - 1) {
          setTimeout(() => {
            this.loadMission(this.currentMissionIndex + 1);
          }, 1800);
        }
      }
    } else {
      window.soundFx?.playError();
      this.setConsoleStatus(`⚠️ ${mission.hint}`, 'error');
    }
  }

  setConsoleStatus(msg, type) {
    if (!this.consoleMsg) return;
    this.consoleMsg.textContent = msg;
    this.consoleMsg.className = `status-msg ${type}`;
  }

  updateMissionUI() {
    // Update sidebar checkmarks
    this.missionCards.forEach((card, idx) => {
      const isDone = this.completedMissions.has(idx);
      card.classList.toggle('completed', isDone);
      const checkSpan = card.querySelector('.m-check');
      if (checkSpan) {
        checkSpan.textContent = isDone ? '✅' : '⚪';
      }
    });

    // Update stars counter & badge
    const count = this.completedMissions.size;
    if (this.missionBadge) this.missionBadge.textContent = `${count}/${MISSIONS.length}`;
    
    const starNum = document.getElementById('starNum');
    if (starNum) starNum.textContent = count * 25; // 25 stars per mission
  }

  celebrateSuccess() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }
}

// Global CodeLab Instance
window.codeLab = null;
document.addEventListener('DOMContentLoaded', () => {
  window.codeLab = new CodeLab();
});
