let score = 100;
const maxScoreAfterQ1 = 110;
const correctAnswer = 3;
let selectedOption = null;
let answerSubmitted = false;
let hintUsed = false;

function showHint() {
  if (hintUsed) return;
  hintUsed = true;
  document.getElementById('hintPopup').classList.add('active');
  var btn = document.getElementById('btnLifeline');
  btn.classList.add('used');
  btn.disabled = true;
  document.getElementById('lifeline-face').textContent = '💡 Hint Used';
}

function closeHint() {
  document.getElementById('hintPopup').classList.remove('active');
}

function resetAboutVideo() {
  var vid = document.getElementById('aboutVideo');
  var btn = document.getElementById('unmuteBtn');
  if (vid) { vid.muted = true; vid.currentTime = 0; vid.play(); }
  if (btn) btn.style.display = '';
}

function unmuteAboutVideo() {
  var vid = document.getElementById('aboutVideo');
  var btn = document.getElementById('unmuteBtn');
  if (vid && btn) {
    vid.muted = false;
    vid.currentTime = 0;
    vid.play();
    btn.style.display = 'none';
  }
}

function showInfoPanel() {
  document.getElementById('infoPopup').classList.add('active');
}

function closeInfo() {
  document.getElementById('infoPopup').classList.remove('active');
}

function updateScoreBadge() {
  var badge = document.getElementById("currentScore");
  if (badge) {
    badge.textContent = score + " pts";
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function(screen) {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

(function() {
  setTimeout(function() {
    showScreen("splash2");
    setTimeout(function() {
      showScreen("landing");
    }, 3000);
  }, 3000);
})();

function startGame() {
  score = 100;
  selectedOption = null;
  answerSubmitted = false;
  hintUsed = false;
  var btn = document.getElementById('btnLifeline');
  if (btn) { btn.classList.remove('used'); btn.disabled = false; }
  var face = document.getElementById('lifeline-face');
  if (face) face.textContent = '💡 Ask for Help';
  updateScoreBadge();
  showScreen("introVideo");
}

function showQuestion() {
  showScreen("question1");
  selectedOption = null;
  answerSubmitted = false;
  updateScoreBadge();
  document.getElementById("feedback").textContent = "";
  document.getElementById("feedback").className = "";
  document.getElementById("submitBtn").disabled = true;
  for (var i = 0; i < 4; i++) {
    var opt = document.getElementById("opt-" + i);
    opt.classList.remove("selected");
    opt.disabled = false;
  }
}

function selectAnswer(index) {
  if (answerSubmitted) return;
  selectedOption = index;
  for (var i = 0; i < 4; i++) {
    var opt = document.getElementById("opt-" + i);
    if (i === index) {
      opt.classList.add("selected");
    } else {
      opt.classList.remove("selected");
    }
  }
  document.getElementById("submitBtn").disabled = false;
}

function submitAnswer() {
  if (selectedOption === null || answerSubmitted) return;
  answerSubmitted = true;
  var feedback = document.getElementById("feedback");

  for (var i = 0; i < 4; i++) {
    document.getElementById("opt-" + i).disabled = true;
  }
  document.getElementById("submitBtn").disabled = true;

  if (selectedOption === correctAnswer) {
    score += 10;
    updateScoreBadge();
    feedback.textContent = "Correct! You earned 10 points.";
    feedback.className = "correct";
    setTimeout(function() { showScreen("correctVideoScreen"); }, 1200);
  } else {
    score -= 15;
    updateScoreBadge();
    feedback.textContent = "Not quite \u2014 try again!";
    feedback.className = "wrong";
    setTimeout(function() { showScreen("wrongVideoScreen"); }, 1200);
  }
}

var syncTimestamps = [3, 6, 9, 12];
var revealCorrectAt = 15;
var syncRevealed = false;

function showQuestionVideo() {
  syncRevealed = false;
  resetSyncOptions();
  showScreen("questionVideoScreen");
  var vid = document.getElementById('questionVideo');
  var btn = document.getElementById('unmuteQVideoBtn');
  if (vid) { vid.muted = true; vid.currentTime = 0; vid.play(); }
  if (btn) btn.style.display = '';
  if (vid) {
    vid.ontimeupdate = function() {
      var t = vid.currentTime;
      var active = null;
      for (var i = syncTimestamps.length - 1; i >= 0; i--) {
        if (t >= syncTimestamps[i]) { active = i; break; }
      }
      highlightSyncOption(active);
      if (t >= revealCorrectAt && !syncRevealed) {
        syncRevealed = true;
        revealSyncCorrect();
      }
    };
    vid.onended = function() {
      syncRevealed = true;
      revealSyncCorrect();
      setTimeout(function() { showQuestion(); }, 2000);
    };
  }
}

function unmuteQuestionVideo() {
  var vid = document.getElementById('questionVideo');
  var btn = document.getElementById('unmuteQVideoBtn');
  if (vid && btn) {
    vid.muted = false;
    vid.currentTime = 0;
    vid.play();
    btn.style.display = 'none';
  }
}

function resetSyncOptions() {
  for (var i = 0; i < 4; i++) {
    var opt = document.getElementById('sync-opt-' + i);
    var letter = document.getElementById('sync-letter-' + i);
    if (opt) { opt.className = 'sync-option'; }
    if (letter) { letter.className = 'sync-letter'; }
  }
}

function highlightSyncOption(activeIndex) {
  for (var i = 0; i < 4; i++) {
    var opt = document.getElementById('sync-opt-' + i);
    var letter = document.getElementById('sync-letter-' + i);
    if (!opt || !letter) continue;
    if (!syncRevealed) {
      if (i === activeIndex) {
        opt.className = 'sync-option highlighted';
        letter.className = 'sync-letter highlighted';
      } else {
        opt.className = 'sync-option';
        letter.className = 'sync-letter';
      }
    }
  }
}

function revealSyncCorrect() {
  for (var i = 0; i < 4; i++) {
    var opt = document.getElementById('sync-opt-' + i);
    var letter = document.getElementById('sync-letter-' + i);
    if (!opt || !letter) continue;
    if (i === correctAnswer) {
      opt.className = 'sync-option correct';
      letter.className = 'sync-letter correct';
    } else {
      opt.className = 'sync-option wrong';
      letter.className = 'sync-letter wrong';
    }
  }
}

function getDrawEntries(percent) {
  if (percent >= 91) return 6;
  if (percent >= 81) return 5;
  if (percent >= 71) return 4;
  if (percent >= 61) return 3;
  if (percent >= 51) return 2;
  return 1;
}

function showScore() {
  showScreen("scoreScreen");
  document.getElementById("scoreText").textContent = score + " points";
  var percent = Math.round((score / maxScoreAfterQ1) * 100);
  document.getElementById("percentText").textContent = percent + "%";

  var entries = getDrawEntries(percent);
  document.getElementById("drawEntriesText").textContent = entries + (entries === 1 ? " Entry" : " Entries");

  var baseUrl = "YOUR_NETLIFY_URL";
  var msg = "I scored " + score + " points on Zero Hunger Quest! Play here: " + baseUrl;
  var grid = document.getElementById("shareGrid");
  var wa = grid.querySelector('[data-testid="link-share-whatsapp"]');
  var fb = grid.querySelector('[data-testid="link-share-facebook"]');
  var tt = grid.querySelector('[data-testid="link-share-tiktok"]');
  var ig = grid.querySelector('[data-testid="link-share-instagram"]');
  var xBtn = grid.querySelector('[data-testid="link-share-x"]');
  var em = grid.querySelector('[data-testid="link-share-email"]');
  wa.href = "https://wa.me/?text=" + encodeURIComponent(msg);
  fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(baseUrl);
  tt.href = "https://www.tiktok.com/";
  ig.href = "https://www.instagram.com/";
  xBtn.href = "https://x.com/intent/tweet?text=" + encodeURIComponent(msg);
  em.href = "mailto:?subject=" + encodeURIComponent("Zero Hunger Quest") + "&body=" + encodeURIComponent("I scored " + score + " points! Play here: " + baseUrl);
}

function submitEntry() {
  alert("Entry submitted! You're in this month's draw. Good luck!");
}

function rateGame() {
  alert("Thank you for playing! Rating feature coming soon.");
}

function resetGame() {
  score = 100;
  selectedOption = null;
  answerSubmitted = false;
  hintUsed = false;
  var btn = document.getElementById('btnLifeline');
  if (btn) { btn.classList.remove('used'); btn.disabled = false; }
  var face = document.getElementById('lifeline-face');
  if (face) face.textContent = '💡 Ask for Help';
  updateScoreBadge();
  showScreen("landing");
}
