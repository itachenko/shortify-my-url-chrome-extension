"use strict";

import "regenerator-runtime";
import axios from "axios";

const apiEndpoint = "http://shortify.one/api/url";
const resultEl = document.getElementById("main-result");
const copyMessageEl = document.getElementById("copying-message");
const loadingMessageEl = document.getElementById("loading-message");
const shortifyBtn = document.getElementById("main-form-btn");

let url;
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  url = tabs[0].url;
});

async function shortifyCurrentUrl() {
  const locallyStoredUrl = localStorage.getItem(url);

  if (locallyStoredUrl) {
    showResult(locallyStoredUrl);
  } else {
    try {
      displayLoadingMessage(true);
      const response = await axios.post(apiEndpoint, {
        url: url,
      });
      displayLoadingMessage(false);

      showResult(response.data.shortUrl);
      localStorage.setItem(url, response.data.shortUrl);
    } catch (error) {
      displayLoadingMessage(false);
      resultEl.textContent = "Invalid or too short original URL";
    }
  }
}

function showResult(text){
  resultEl.textContent = text;
  copyMessageEl.style.display = "block";
  copyToClipboard();
}

function copyToClipboard() {
  var textArea = document.createElement("textarea");
  textArea.value = resultEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function displayLoadingMessage(isVisible) {
  if (isVisible) loadingMessageEl.style.display = "block";
  else loadingMessageEl.style.display = "none";
}

shortifyBtn.addEventListener("click", shortifyCurrentUrl);
