const questions=[
  {title:"What is your main complaint?",text:"Please describe what brought you to the hospital today.",answers:["Pain","Fever","Cough / breathing problem","Other"]},
  {title:"When did it start?",text:"Tell us when the problem began and whether it is getting better or worse.",answers:["Today","1–3 days ago","More than a week ago","Not sure"]},
  {title:"What makes it better or worse?",text:"Select any factor that changes the symptom.",answers:["Activity","Food","Rest","Nothing specific"]},
  {title:"Do you have any important medical history?",text:"Tell us about previous illnesses, surgeries, medicines or allergies.",answers:["Diabetes","Blood pressure","Previous surgery","No known history"]}
];
let q=0, selectedComplaint="Chest discomfort for 2 days.";

function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active-page'));
  document.getElementById(page).classList.add('active-page');
  document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  window.scrollTo({top:0,behavior:'smooth'});
}
function startInterview(){
  if(!document.getElementById('consent').checked){showToast('Please provide consent before continuing');return;}
  document.getElementById('interview').classList.remove('hidden');
  renderQuestion();
  showToast('Secure intake session started');
}
function renderQuestion(){
  const item=questions[q];
  document.getElementById('question-title').textContent=item.title;
  document.getElementById('question-text').textContent=item.text;
  document.getElementById('answers').innerHTML=item.answers.map(a=>`<button class="answer" onclick="chooseAnswer('${a.replaceAll("'","")}')">${a}</button>`).join('');
  document.getElementById('progress-bar').style.width=((q+1)/questions.length*100)+'%';
}
function chooseAnswer(a){
  if(q===0){selectedComplaint=a==="Pain"?"Chest discomfort for 2 days.":a+". Reported during intake.";}
  document.getElementById('free-answer').value=a;
  showToast('Answer captured');
}
function nextQuestion(){
  const val=document.getElementById('free-answer').value.trim();
  if(q===0 && val) selectedComplaint=val;
  if(q<questions.length-1){q++;document.getElementById('free-answer').value='';renderQuestion();}
  else{document.getElementById('summary-complaint').textContent=selectedComplaint;showToast('Clinical history draft generated');go('summary');}
}
function simulateVoice(){
  document.getElementById('free-answer').value='Voice input captured: chest discomfort for two days';
  showToast('Demo speech-to-text completed');
}
function simulateOCR(type){
  const box=document.getElementById('ocr-result');
  box.innerHTML=`<b>✓ ${type} processed</b><br><br>OCR → Medical entity extraction → Date extraction → Timeline update.<br><br><b>Demo entities:</b> medication, investigation value, date and prior procedure. <span style="color:#9a7125">Extracted information requires physician verification.</span>`;
  showToast(`${type} scanned and digitized`);
}
function matchDonors(){
  document.getElementById('donor-results').innerHTML=`<h3>Potential Donors / Support Options</h3>
  <div class="alert success">✓ Matching request created for O+ at current hospital location.</div>
  <div class="summary-section"><h3>Demo Match 01</h3><p>Eligible donor profile · Same blood group · Nearby location</p><button class="secondary" onclick="showToast('Contact coordination started')">Contact Coordination</button></div>
  <div class="summary-section"><h3>Demo Match 02</h3><p>Eligible donor profile · Same blood group · Availability verified</p><button class="secondary" onclick="showToast('Contact coordination started')">Contact Coordination</button></div>`;
}
function sendChat(){
  const input=document.getElementById('chatInput'); const text=input.value.trim(); if(!text)return;
  const chat=document.getElementById('chat');
  chat.innerHTML+=`<div class="user-msg">${escapeHtml(text)}</div>`;
  const reply=text.toLowerCase().includes('history')?
    "The current draft contains chief complaint, HPI, past history, drug/allergy history, family/personal history and review-of-systems fields. The physician must verify them.":
    "I can explain information already recorded in the patient record. I cannot independently diagnose or prescribe.";
  setTimeout(()=>{chat.innerHTML+=`<div class="bot">${reply}</div>`;chat.scrollTop=chat.scrollHeight;},250);
  input.value='';
}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200);}
