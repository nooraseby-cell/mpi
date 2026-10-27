
function toggleMenu(){var n=document.getElementById('mainNav'); if(n) n.classList.toggle('open');}
function getProgress(){try{return JSON.parse(localStorage.getItem('mpiProgress')||'{}')}catch(e){return {}}}
function saveProgress(p){localStorage.setItem('mpiProgress',JSON.stringify(p));}
function refreshProgress(){
  var p=getProgress();
  var totals={7:10,8:11,9:8};
  Object.keys(totals).forEach(function(k){
    var done=0; Object.keys(p).forEach(function(code){ if(p[code] && p[code].done){ /* map by first TP list below */ } });
    // Count by known kelas mapping stored in page data attribute if present
  });
  document.querySelectorAll('[data-progress-fill]').forEach(function(el){
    var k=el.getAttribute('data-progress-fill'); var codes=(window.MPI_KELAS_CODES||{})[k]||[]; var done=codes.filter(function(c){return p[c]&&p[c].done}).length; var pct=codes.length?Math.round(done/codes.length*100):0; el.style.width=pct+'%';
    document.querySelectorAll('[data-progress-text="'+k+'"]').forEach(function(t){t.textContent=pct+'% ('+done+' dari '+codes.length+' TP)';});
  });
  // Also update progress text on pages without a progress bar (e.g. Beranda)
  document.querySelectorAll('[data-progress-text]').forEach(function(t){
    var k=t.getAttribute('data-progress-text'); var codes=(window.MPI_KELAS_CODES||{})[k]||[]; if(!codes.length) return; var done=codes.filter(function(c){return p[c]&&p[c].done}).length; var pct=Math.round(done/codes.length*100); t.textContent=pct+'% ('+done+' dari '+codes.length+' TP)';
  });
  var code=window.MPI_CODE; if(code && p[code] && p[code].done){var s=document.getElementById('status-'+code); if(s) s.textContent='Selesai ✓';}
}
document.addEventListener('click',function(e){
  var b=e.target.closest('.quiz-opt'); if(!b) return;
  var q=b.getAttribute('data-q'); var quiz=b.closest('.quiz'); quiz.querySelectorAll('.quiz-opt[data-q="'+q+'"]').forEach(function(x){x.classList.remove('picked');});
  b.classList.add('picked');
  var fb=document.getElementById('fb-'+quiz.getAttribute('data-quiz')+'-'+q);
  if(b.getAttribute('data-correct')==='1'){b.classList.add('right'); if(fb) fb.textContent='Benar. Bagus!';}
  else{b.classList.add('wrong'); if(fb) fb.textContent='Belum tepat. Coba ingat lagi langkahnya, lalu periksa jawaban lain.';}
});
function finishQuiz(code){
  var quiz=document.querySelector('[data-quiz="'+code+'"]'); if(!quiz) return;
  var qs=quiz.querySelectorAll('.q'); var correct=0; qs.forEach(function(q,i){var picked=q.querySelector('.quiz-opt.picked'); if(picked && picked.getAttribute('data-correct')==='1') correct++;});
  var score=Math.round(correct/qs.length*100); var el=document.getElementById('score-'+code); if(el) el.textContent='Skormu: '+correct+' dari '+qs.length+' benar ('+score+'%).';
  var p=getProgress(); p[code]={score:score,done:score>=60}; saveProgress(p); refreshProgress();
  var s=document.getElementById('status-'+code); if(s && score>=60) s.textContent='Selesai ✓';
}
function printLKPD(){document.body.classList.add('printing-lkpd'); window.print(); setTimeout(function(){document.body.classList.remove('printing-lkpd')},800);}
window.addEventListener('afterprint',function(){document.body.classList.remove('printing-lkpd');});
window.MPI_KELAS_CODES={7:['b1','b2','b3','b4','a1','g1','g2','g3','d1','d2'],8:['b5','b6','b7','g4','a2','a3','a4','a5','a6','d3','d4'],9:['a7','g5','p1','p2','p3','g6','d5','d6']};
document.addEventListener('DOMContentLoaded',refreshProgress);
