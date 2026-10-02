/**
 * CSS SEHRGARLARI — SLIDES INTERACTIVITY MODULE
 * Implements direct manipulation, tactile controls, and visual cause-and-effect for Slides 1-6.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSlide1();
  initSlide2();
  initSlide3();
  initSlide4();
  initSlide5();
  initSlide6();
});

/* --------------------------------------------------------------------------
   SLIDE 1: :hover — ROBOT WAKE UP
   -------------------------------------------------------------------------- */
function initSlide1() {
  const robot = document.getElementById('robotChar');
  const badge = document.getElementById('hoverStatusBadge');
  const btnTestHover = document.getElementById('btnTestHover');
  if (!robot) return;

  const setAwake = (awake) => {
    if (awake) {
      robot.classList.add('force-hover');
      if (badge) {
        badge.innerHTML = '<span class="status-dot" style="background:#22c55e;"></span> Holat: Uyg\'ondi va salom bermoqda! 🤖👋';
      }
      window.soundFx?.playHover();
    } else {
      robot.classList.remove('force-hover');
      if (badge) {
        badge.innerHTML = '<span class="status-dot"></span> Holat: Uxlab yotibdi 😴';
      }
    }
  };

  robot.addEventListener('mouseenter', () => setAwake(true));
  robot.addEventListener('mouseleave', () => setAwake(false));
  robot.addEventListener('touchstart', (e) => {
    e.preventDefault();
    setAwake(true);
  }, { passive: false });
  robot.addEventListener('touchend', () => {
    setTimeout(() => setAwake(false), 1500);
  });

  // Simulation Button
  let isSimulating = false;
  if (btnTestHover) {
    btnTestHover.addEventListener('click', () => {
      window.soundFx?.playClick();
      isSimulating = !isSimulating;
      setAwake(isSimulating);
      btnTestHover.textContent = isSimulating ? "Uyqu rejimiga qaytarish" : "Teginib ko'rish (Simulyatsiya)";
    });
  }
}

/* --------------------------------------------------------------------------
   SLIDE 2: opacity — GHOST INVISIBILITY CLOAK
   -------------------------------------------------------------------------- */
function initSlide2() {
  const ghost = document.getElementById('ghostWrapper');
  const slider = document.getElementById('opacitySlider');
  const valDisplay = document.getElementById('opacityValDisplay');
  const codeVal = document.getElementById('codeOpacityVal');
  const valueTag = document.getElementById('ghostValueTag');
  const presets = document.querySelectorAll('#slide2 .preset-pill');

  if (!slider || !ghost) return;

  const updateOpacity = (val) => {
    const num = parseFloat(val);
    ghost.style.opacity = num;
    if (valDisplay) valDisplay.textContent = num.toFixed(2);
    if (codeVal) codeVal.textContent = num.toFixed(2);
    if (valueTag) valueTag.textContent = `opacity: ${num.toFixed(2)}`;

    // Update preset pills active status
    presets.forEach(btn => {
      const pVal = parseFloat(btn.dataset.opacity);
      btn.classList.toggle('active', Math.abs(pVal - num) < 0.05);
    });
  };

  slider.addEventListener('input', (e) => {
    updateOpacity(e.target.value);
    window.soundFx?.playSlider(parseFloat(e.target.value));
  });

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundFx?.playClick();
      const pVal = btn.dataset.opacity;
      slider.value = pVal;
      updateOpacity(pVal);
    });
  });
}

/* --------------------------------------------------------------------------
   SLIDE 3: transform: scale() — ELASTIC TREASURE CHEST
   -------------------------------------------------------------------------- */
function initSlide3() {
  const chest = document.getElementById('elasticChest');
  const slider = document.getElementById('scaleSlider');
  const valDisplay = document.getElementById('scaleValDisplay');
  const codeVal = document.getElementById('codeScaleVal');
  const badge = document.getElementById('scaleFactorBadge');
  const presets = document.querySelectorAll('#slide3 .preset-pill');

  if (!slider || !chest) return;

  const updateScale = (val) => {
    const num = parseFloat(val);
    chest.style.transform = `scale(${num})`;
    if (valDisplay) valDisplay.textContent = `${num.toFixed(1)}x`;
    if (codeVal) codeVal.textContent = `scale(${num.toFixed(1)})`;
    if (badge) badge.textContent = `scale(${num.toFixed(1)})`;

    presets.forEach(btn => {
      const pVal = parseFloat(btn.dataset.scale);
      btn.classList.toggle('active', Math.abs(pVal - num) < 0.05);
    });
  };

  slider.addEventListener('input', (e) => {
    updateScale(e.target.value);
    const normalized = (parseFloat(e.target.value) - 0.5) / 1.7;
    window.soundFx?.playSlider(normalized);
  });

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundFx?.playClick();
      const pVal = btn.dataset.scale;
      slider.value = pVal;
      updateScale(pVal);
    });
  });
}

/* --------------------------------------------------------------------------
   SLIDE 4: box-shadow — 3D UFO LEVITATION
   -------------------------------------------------------------------------- */
function initSlide4() {
  const ufo = document.getElementById('ufoCard');
  const slider = document.getElementById('shadowElevationSlider');
  const valDisplay = document.getElementById('elevationValDisplay');
  const codeVal = document.getElementById('codeShadowVal');
  const swatches = document.querySelectorAll('#shadowColorSwatches .color-swatch');

  if (!slider || !ufo) return;

  let currentColor = '#0284c7';

  const updateShadow = () => {
    const elev = parseInt(slider.value, 10);
    const blur = Math.round(elev * 1.5) + 10;
    
    // Apply 3D elevation + box-shadow
    ufo.style.transform = `translateY(-${elev}px)`;
    ufo.style.boxShadow = `0 ${elev}px ${blur}px ${currentColor}`;

    if (valDisplay) {
      if (elev === 0) valDisplay.textContent = 'Erda (0px)';
      else if (elev < 25) valDisplay.textContent = `Past (${elev}px)`;
      else if (elev < 45) valDisplay.textContent = `O'rtacha (${elev}px)`;
      else valDisplay.textContent = `Juda Baland (${elev}px)`;
    }

    if (codeVal) {
      codeVal.textContent = `0 ${elev}px ${blur}px ${currentColor}`;
    }
  };

  slider.addEventListener('input', () => {
    updateShadow();
    window.soundFx?.playSlider(parseInt(slider.value, 10) / 60);
  });

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      window.soundFx?.playClick();
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      currentColor = swatch.dataset.color;
      updateShadow();
    });
  });

  // Initial update
  updateShadow();
}

/* --------------------------------------------------------------------------
   SLIDE 5: transition — RACE TRACK SPEED COMPARISON
   -------------------------------------------------------------------------- */
function initSlide5() {
  const shipNo = document.getElementById('shipNoTrans');
  const shipWith = document.getElementById('shipWithTrans');
  const btnRace = document.getElementById('btnStartRace');
  const slider = document.getElementById('durationSlider');
  const valDisplay = document.getElementById('durationValDisplay');
  const codeVal = document.getElementById('codeDurationVal');
  const speedLabel = document.getElementById('transSpeedLabel');
  const presets = document.querySelectorAll('#slide5 .preset-pill');

  if (!btnRace || !shipNo || !shipWith) return;

  let isRacing = false;

  const updateDuration = (val) => {
    const dur = parseFloat(val);
    shipWith.style.transitionDuration = `${dur}s`;
    if (valDisplay) valDisplay.textContent = `${dur.toFixed(1)}s`;
    if (codeVal) codeVal.textContent = `${dur.toFixed(1)}s ease-in-out`;
    if (speedLabel) speedLabel.textContent = `${dur.toFixed(1)} soniyada silliq`;

    presets.forEach(btn => {
      const pVal = parseFloat(btn.dataset.dur);
      btn.classList.toggle('active', Math.abs(pVal - dur) < 0.05);
    });
  };

  slider.addEventListener('input', (e) => {
    updateDuration(e.target.value);
    const normalized = (parseFloat(e.target.value) - 0.1) / 1.9;
    window.soundFx?.playSlider(normalized);
  });

  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundFx?.playClick();
      const pVal = btn.dataset.dur;
      slider.value = pVal;
      updateDuration(pVal);
    });
  });

  btnRace.addEventListener('click', () => {
    if (isRacing) return;
    isRacing = true;
    window.soundFx?.playLaunch();

    // Reset positions
    shipNo.classList.remove('reached-finish');
    shipWith.classList.remove('reached-finish');

    setTimeout(() => {
      // Launch both ships
      shipNo.classList.add('reached-finish');
      shipWith.classList.add('reached-finish');

      const durMs = parseFloat(slider.value) * 1000;
      setTimeout(() => {
        window.soundFx?.playSuccess();
        setTimeout(() => {
          shipNo.classList.remove('reached-finish');
          shipWith.classList.remove('reached-finish');
          isRacing = false;
        }, 1200);
      }, Math.max(durMs, 400));
    }, 100);
  });
}

/* --------------------------------------------------------------------------
   SLIDE 6: MASTER SYNERGY — SUPER ROCKET
   -------------------------------------------------------------------------- */
function initSlide6() {
  const rocket = document.getElementById('megaRocket');
  const chkScale = document.getElementById('chkScale');
  const chkShadow = document.getElementById('chkShadow');
  const chkTrans = document.getElementById('chkTrans');
  const badge = document.getElementById('synergyStatusBadge');
  const btnLaunch = document.getElementById('btnLaunchLab');

  if (!rocket) return;

  const updateSynergyStyles = () => {
    const hasScale = chkScale ? chkScale.checked : true;
    const hasShadow = chkShadow ? chkShadow.checked : true;
    const hasTrans = chkTrans ? chkTrans.checked : true;

    rocket.style.transition = hasTrans ? 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none';

    // Set interactive hover state inline overrides
    rocket.onmouseenter = () => {
      window.soundFx?.playHover();
      let transformStr = 'translateY(-25px)';
      if (hasScale) transformStr += ' scale(1.18)';
      rocket.style.transform = transformStr;
      rocket.style.boxShadow = hasShadow ? '0 30px 60px rgba(245, 158, 11, 0.6)' : 'none';
      if (badge) badge.textContent = "Super Raketa ishga tushdi! 🚀🔥";
    };

    rocket.onmouseleave = () => {
      rocket.style.transform = 'translateY(0) scale(1)';
      rocket.style.boxShadow = 'none';
      if (badge) badge.textContent = "Sichqonchani raketa ustiga olib keling!";
    };
  };

  [chkScale, chkShadow, chkTrans].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        window.soundFx?.playClick();
        chk.closest('.toggle-pill').classList.toggle('active', chk.checked);
        updateSynergyStyles();
      });
    }
  });

  updateSynergyStyles();

  // Jump to Code Lab button
  if (btnLaunch) {
    btnLaunch.addEventListener('click', () => {
      window.soundFx?.playClick();
      const codeTab = document.getElementById('tabCodeLab');
      if (codeTab) codeTab.click();
    });
  }
}
