"use strict";

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
  try {
    displayLoadingMessage(true);
    const response = await axios.post(apiEndpoint, {
      url: url,
    });

    displayLoadingMessage(false);
    resultEl.textContent = response.data.shortUrl;
    displayCopyMessage();
    copyToClipboard();
  } catch (error) {
    displayLoadingMessage(false);
    resultEl.textContent = "Invalid or too short original URL";
  }
}

function copyToClipboard() {
  var textArea = document.createElement("textarea");
  textArea.value = resultEl.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function displayCopyMessage() {
  copyMessageEl.style.display = "block";
}

function displayLoadingMessage(isVisible) {
  if (isVisible) loadingMessageEl.style.display = "block";
  else loadingMessageEl.style.display = "none";
}

shortifyBtn.addEventListener("click", shortifyCurrentUrl);
