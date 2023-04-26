// ==UserScript==
// @name         Yuketang Unveil
// @namespace    http://github.com/liang2kl/
// @version      0.1
// @description  自动显示被“当前页面有动画，请听老师讲解”隐藏的 PPT 页面。
// @author       Liang Yesheng
// @match        https://*.yuketang.cn/*
// @match        https://yuketang.cn/*
// @grant        none
// ==/UserScript==

/**
 * Mutation Observer Helper function
 * //developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
 * @param {string} sel The DOM selector to watch 
 * @param {object} opt MutationObserver options 
 * @param {function} cb Pass Mutation object to a callback function
 */
const observe = (sel, opt, cb) => {
  const Obs = new MutationObserver((m) => [...m].forEach(cb));
  document.querySelectorAll(sel).forEach(el => Obs.observe(el, opt));
  return Obs;
};

// Setup after the page is loaded
window.addEventListener("load", (e) => {
  setTimeout(() => {
    main();
  }, 1000);
}, false);

const main = () => {
  // Detect initial style
  unveilOnce();
  // Setup observers
  setupObservers();

  // Reset observers on pushing new slides
  observe(".timeline__wrap", { childList: true }, (m) => {
    console.log("[yuketang-unveil] reloading observers");
    unveilOnce();
    setupObservers();
  });

  console.log("[yuketang-unveil] extension is working!");
}

const slideSelector = ".slide__cmp";
const coverSelector = ".ppt__modal";
var slideObserver = null;
var coverObserver = null;

const setupObservers = () => {
  // Disconnect previous observations
  if (slideObserver != null) {
    slideObserver.disconnect();
  }
  if (coverObserver != null) {
    coverObserver.disconnect();
  }

  // Setup observers on related elements
  slideObserver = observe(slideSelector, {
    attributes: ["style"],
  }, (m) => {
    if (m.target.style.display == "none") {
      m.target.style.display = null;
      console.log("[yuketang-unveil] unveiled slide");
    }
  });

  coverObserver = observe(coverSelector, {
    attributes: ["style"],
  }, (m) => {
    if (m.target.style.display != "none") {
      m.target.style.display = "none";
      console.log("[yuketang-unveil] veiled cover");
    }
  });

}

const unveilOnce = () => {
  const slide = document.querySelector(slideSelector);
  const cover = document.querySelector(coverSelector);

  if (slide && slide.style.display == "none") {
    slide.style.display = null;
  }
  if (cover && cover.style.display != "none") {
    cover.style.display = "none";
  }
}