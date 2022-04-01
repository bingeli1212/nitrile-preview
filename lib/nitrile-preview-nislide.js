'use babel';
const { NitrilePreviewBase } = require('./nitrile-preview-base');
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewLatex } = require('./nitrile-preview-latex');
const { NitrilePreviewContex } = require('./nitrile-preview-contex');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
//const mysvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"> <polyline stroke="#1010B0" stroke-width="3" fill="none" points="7 1 13 7 7 13"/> <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="3" /> </svg>`; 
const mysvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"> <polygon stroke="none" fill="#1010B0" points="10 6 2 10 2 2"/> </svg>`; 
const myimg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(mysvg)}`;
var script = `\
const mp_endpoint = 0;
const mp_explicit = 1;
const mp_given = 2;
const mp_curl = 3;
const mp_open = 4;
const mp_end_cycle = 5;
const unity = 1.0;
const two = 2.0;
const fraction_half = 0.5;
const fraction_one = 1.0;
const fraction_three = 3.0;
const one_eighty_deg = Math.PI;
const three_sixty_deg = 2 * Math.PI;
const epsilon = 1e-5;
function mp_make_choices (knots) {
  var dely_pt, h, k, delx_pt, n, q, p, s, cosine, t, sine;
  // "Implements mp_make_choices from metapost (mp.c)";
  p = knots;
  while (true) {
    if (!p) {
      break;
    }
    q = p.next;
    if (p.rtype > mp_explicit && (Math.pow(p.x_pt - q.x_pt, 2) + Math.pow(p.y_pt - q.y_pt,2) < Math.pow(epsilon, 2))) {
      p.rtype = mp_explicit;
      if (p.ltype == mp_open) {
        p.ltype = mp_curl;
        p.set_left_curl(unity);
      }
      q.ltype = mp_explicit;
      if (q.rtype == mp_open) {
        q.rtype = mp_curl;
        q.set_right_curl(unity);
      }
      p.rx_pt = p.x_pt;
      q.lx_pt = p.x_pt;
      p.ry_pt = p.y_pt;
      q.ly_pt = p.y_pt;
    }
    p = q;
    if (p == knots) {
      break;
    }
  }
  h = knots;
  while (true) {
    if (h.ltype != mp_open || h.rtype != mp_open) {
      break;
    }
    h = h.next;
    if (h == knots) {
      h.ltype = mp_end_cycle;
      break;
    }
  }
  p = h;
  while (true) {
    if (!p) {
      break;
    }

    q = p.next;
    if (p.rtype >= mp_given) {
      while (q.ltype == mp_open && q.rtype == mp_open) {
        q = q.next;
      }
      k = 0;
      s = p;
      n = linked_len(knots);//.linked_len();
      var delta_x = [], delta_y = [], delta = [], psi = [null];
      // tuple([]) = tuple([[], [], [], [null]]);
      while (true) {
        t = s.next;
        // None;
        delta_x.push(t.x_pt - s.x_pt);
        delta_y.push(t.y_pt - s.y_pt);
        delta.push( mp_pyth_add(delta_x[k], delta_y[k]) );
        if (k > 0) {
          sine = mp_make_fraction(delta_y[k - 1], delta[k - 1]);
          cosine = mp_make_fraction(delta_x[k - 1], delta[k - 1]);
          psi.push(
            mp_n_arg(
              mp_take_fraction(delta_x[k], cosine) + mp_take_fraction(delta_y[k], sine),
              mp_take_fraction(delta_y[k], cosine) - mp_take_fraction(delta_x[k], sine)
              )
            );
        }
        k += 1;
        s = t;
        if (s == q) {
          n = k;
        }
        if (k >= n && s.ltype != mp_end_cycle) {
          break;
        }
      }
      if (k == n) {
        psi.push(0);
      } else {
        psi.push(psi[1]);
      }
      if (q.ltype == mp_open) {
        delx_pt = (q.rx_pt - q.x_pt);
        dely_pt = (q.ry_pt - q.y_pt);
        if ((Math.pow(delx_pt, 2) + Math.pow(dely_pt, 2)) < Math.pow(epsilon, 2)) {
          q.ltype = mp_curl;
          q.set_left_curl(unity);
        } else {
          q.ltype = mp_given;
          q.set_left_given(mp_n_arg(delx_pt, dely_pt));
        }
      }
      if (p.rtype == mp_open && p.ltype == mp_explicit) {
        delx_pt = (p.x_pt - p.lx_pt);
        dely_pt = (p.y_pt - p.ly_pt);
        if ((Math.pow(delx_pt, 2) + Math.pow(dely_pt, 2)) < Math.pow(epsilon, 2)) {
          p.rtype = mp_curl;
          p.set_right_curl(unity);
        } else {
          p.rtype = mp_given;
          p.set_right_given(mp_n_arg(delx_pt, dely_pt));
        }
      }
      mp_solve_choices(p, q, n, delta_x, delta_y, delta, psi);
    } else if (p.rtype == mp_endpoint) {
      p.rx_pt = p.x_pt;
      p.ry_pt = p.y_pt;
      q.lx_pt = q.x_pt;
      q.ly_pt = q.y_pt;
    }
    p = q;
    if (p == h) {
      break;
    }
  }
}
function mp_solve_choices (p, q, n, delta_x, delta_y, delta, psi) {
  var aa, acc, vv, bb, ldelta, ee, k, s, ww, uu, lt, r, t, ff, theta, rt, dd, cc;
  // "Implements mp_solve_choices form metapost (mp.c)";
  ldelta = delta.length + 1;
  uu = new Array(ldelta);
  ww = new Array(ldelta);
  vv = new Array(ldelta);
  theta = new Array(ldelta);
  for (var i=0; i<ldelta; i++) {
    theta[i] = vv[i] = ww[i] = uu[i] = 0;
  }
  k = 0;
  s = p;
  r = 0;
  while (true) {
    t = s.next;
    if (k == 0) {
      if (s.rtype == mp_given) {
        if (t.ltype == mp_given) {
          aa = mp_n_arg(delta_x[0], delta_y[0]);
          // tuple([ct, st]) = mp_n_sin_cos((p.right_given() - aa));
          // tuple([cf, sf]) = mp_n_sin_cos((q.left_given() - aa));
          var ct_st = mp_n_sin_cos(p.right_given() - aa);
          var ct = ct_st[0];
          var st = ct_st[1];
          var cf_sf = mp_n_sin_cos(q.left_given() - aa);
          var cf = cf_sf[0];
          var sf = cf_sf[1];
          mp_set_controls(p, q, delta_x[0], delta_y[0], st, ct, -sf, cf);
          return;
        } else {
          vv[0] = s.right_given() - mp_n_arg(delta_x[0], delta_y[0]);
          vv[0] = reduce_angle(vv[0]);
          uu[0] = 0;
          ww[0] = 0;
        }
      } else {
        if (s.rtype == mp_curl) {
          if (t.ltype == mp_curl) {
            p.rtype = mp_explicit;
            q.ltype = mp_explicit;
            lt = Math.abs(q.left_tension());
            rt = Math.abs(p.right_tension());
            ff = mp_make_fraction(unity, 3.0 * rt);
            p.rx_pt = p.x_pt + mp_take_fraction(delta_x[0], ff);
            p.ry_pt = p.y_pt + mp_take_fraction(delta_y[0], ff);
            ff = mp_make_fraction(unity, 3.0 * lt);
            q.lx_pt = q.x_pt - mp_take_fraction(delta_x[0], ff);
            q.ly_pt = q.y_pt - mp_take_fraction(delta_y[0], ff);
            return;
          } else {
            cc = s.right_curl();
            lt = Math.abs(t.left_tension());
            rt = Math.abs(s.right_tension());
            uu[0] = mp_curl_ratio(cc, rt, lt);
            vv[0] = -mp_take_fraction(psi[1], uu[0]);
            ww[0] = 0;
          }
        } else {
          if (s.rtype == mp_open) {
            uu[0] = 0;
            vv[0] = 0;
            ww[0] = fraction_one;
          }
        }
      }
    } else {
      if (s.ltype == mp_end_cycle || s.ltype == mp_open) {
        aa = mp_make_fraction(unity, 3.0 * Math.abs(r.right_tension()) - unity);
        dd = mp_take_fraction(delta[k], fraction_three - mp_make_fraction(unity, Math.abs(r.right_tension())));
        bb = mp_make_fraction(unity, 3 * Math.abs(t.left_tension()) - unity);
        ee = mp_take_fraction(delta[k - 1], fraction_three - mp_make_fraction(unity, Math.abs(t.left_tension())));
        cc = (fraction_one - mp_take_fraction(uu[k - 1], aa));
        dd = mp_take_fraction(dd, cc);
        lt = Math.abs(s.left_tension());
        rt = Math.abs(s.right_tension());
        if (lt < rt) {
          dd *= Math.pow(lt / rt, 2);
        } else {
          if (lt > rt) {
            ee *= Math.pow(rt / lt, 2);
          }
        }
        ff = mp_make_fraction(ee, (ee + dd));
        uu[k] = mp_take_fraction(ff, bb);
        acc = -(mp_take_fraction(psi[k + 1], uu[k]));
        if (r.rtype == mp_curl) {
          ww[k] = 0;
          vv[k] = (acc - mp_take_fraction(psi[1], (fraction_one - ff)));
        } else {
          ff = mp_make_fraction((fraction_one - ff), cc);
          acc = (acc - mp_take_fraction(psi[k], ff));
          ff = mp_take_fraction(ff, aa);
          vv[k] = (acc - mp_take_fraction(vv[k - 1], ff));
          ww[k] = -(mp_take_fraction(ww[k - 1], ff));
        }
        if (s.ltype == mp_end_cycle) {
          aa = 0;
          bb = fraction_one;
          while (true) {
            k -= 1;
            if (k == 0) {
              k = n;
            }
            aa = (vv[k] - mp_take_fraction(aa, uu[k]));
            bb = (ww[k] - mp_take_fraction(bb, uu[k]));
            if (k == n) {
              break;
            }
          }
          aa = mp_make_fraction(aa, (fraction_one - bb));
          theta[n] = aa;
          vv[0] = aa;
          // k_val = range(1, n);
          // for (k_idx in k_val) {
          for (var k=1; k<n; k++) {
            // k = k_val[k_idx];
            vv[k] = (vv[k] + mp_take_fraction(aa, ww[k]));
          }
          break;
        }
      } else {
        if (s.ltype == mp_curl) {
          cc = s.left_curl();
          lt = Math.abs(s.left_tension());
          rt = Math.abs(r.right_tension());
          ff = mp_curl_ratio(cc, lt, rt);
          theta[n] = -(mp_make_fraction(mp_take_fraction(vv[n - 1], ff), (fraction_one - mp_take_fraction(ff, uu[n - 1]))));
          break;
        } else {
          if (s.ltype == mp_given) {
            theta[n] = (s.left_given() - mp_n_arg(delta_x[n - 1], delta_y[n - 1]));
            theta[n] = reduce_angle(theta[n]);
            break;
          }
        }
      }
    }
    r = s;
    s = t;
    k += 1;
  }
  // k_val = range((n - 1), -1, -1);
  // for k in range(n-1, -1, -1):
  // for (k_idx in k_val) {
  for (var k=n-1; k>-1; k-=1) {
    // console.log('theta0', k, vv[k], uu[k], theta[k + 1]);
    theta[k] = (vv[k] - mp_take_fraction(theta[k + 1], uu[k]));
    // console.log('theta', k, theta[k]);
  }
  s = p;
  k = 0;
  while (true) {
    t = s.next;
    // tuple([ct, st]) = mp_n_sin_cos(theta[k]);
    // tuple([cf, sf]) = mp_n_sin_cos((-(psi[k + 1]) - theta[k + 1]));
    ct_st = mp_n_sin_cos(theta[k]);
    ct = ct_st[0];
    st = ct_st[1];
    cf_sf = mp_n_sin_cos((-(psi[k + 1]) - theta[k + 1]));
    cf = cf_sf[0];
    sf = cf_sf[1];
    // console.log('mp_set_controls', k, delta_x[k], delta_y[k], st, ct, sf, cf);
    mp_set_controls(s, t, delta_x[k], delta_y[k], st, ct, sf, cf);
    k += 1;
    s = t;
    if (k == n) {
      break;
    }
  }
}
function mp_n_arg (x, y) {
  return Math.atan2(y, x);
}
function mp_n_sin_cos (z) {
  return [Math.cos(z), Math.sin(z)];
}
function mp_set_controls (p, q, delta_x, delta_y, st, ct, sf, cf) {
  var rt, ss, lt, sine, rr;
  lt = Math.abs(q.left_tension());
  rt = Math.abs(p.right_tension());
  rr = mp_velocity(st, ct, sf, cf, rt);
  ss = mp_velocity(sf, cf, st, ct, lt);
  // console.log('lt rt rr ss', lt, rt, rr, ss);
  if (p.right_tension() < 0 || q.left_tension() < 0) {
    if (st >= 0 && sf >= 0 || st <= 0 && sf <= 0) {
      sine = (mp_take_fraction(Math.abs(st), cf) + mp_take_fraction(Math.abs(sf), ct));
      if (sine > 0) {
        sine *= 1.00024414062;
        if (p.right_tension() < 0) {
          if (mp_ab_vs_cd(Math.abs(sf), fraction_one, rr, sine) < 0) {
            rr = mp_make_fraction(Math.abs(sf), sine);
          }
        }
        if (q.left_tension() < 0) {
          if (mp_ab_vs_cd(Math.abs(st), fraction_one, ss, sine) < 0) {
            ss = mp_make_fraction(Math.abs(st), sine);
          }
        }
      }
    }
  }
  p.rx_pt = (p.x_pt + mp_take_fraction((mp_take_fraction(delta_x, ct) - mp_take_fraction(delta_y, st)), rr));
  p.ry_pt = (p.y_pt + mp_take_fraction((mp_take_fraction(delta_y, ct) + mp_take_fraction(delta_x, st)), rr));
  q.lx_pt = (q.x_pt - mp_take_fraction((mp_take_fraction(delta_x, cf) + mp_take_fraction(delta_y, sf)), ss));
  q.ly_pt = (q.y_pt - mp_take_fraction((mp_take_fraction(delta_y, cf) - mp_take_fraction(delta_x, sf)), ss));
  p.rtype = mp_explicit;
  q.ltype = mp_explicit;
}
function mp_make_fraction (p, q) {
  return p / q;
}
function mp_take_fraction (q, f) {
  return q * f;
}
function mp_pyth_add (a, b) {
  return Math.sqrt((a * a + b * b));
}
function mp_curl_ratio (gamma, a_tension, b_tension) {
  var alpha, beta;
  alpha = 1.0 / a_tension;
  beta = 1.0 / b_tension;
  return Math.min (4.0,
    ((3.0 - alpha) * Math.pow(alpha, 2) * gamma + Math.pow(beta, 3)) / (Math.pow(alpha, 3) * gamma + (3.0 - beta) * Math.pow(beta, 2))
    );
}
function mp_ab_vs_cd (a, b, c, d) {
  if (a * b == c * d) {
    return 0;
  }
  if (a * b > c * d) {
    return 1;
  }
  return -1;
}
function mp_velocity (st, ct, sf, cf, t) {
  return Math.min (4.0,
    (2.0 + Math.sqrt(2) * (st - sf / 16.0) * (sf - st / 16.0) * (ct - cf)) / (1.5 * t * ((2 + (Math.sqrt(5) - 1) * ct) + (3 - Math.sqrt(5)) * cf))
    );
}
function reduce_angle (A) {
  if (Math.abs(A) > one_eighty_deg) {
    if (A > 0) {
      A -= three_sixty_deg;
    } else {
      A += three_sixty_deg;
    }
  }
  return A;
}
function linked_len (self) {
  var n = 1
  var p = self.next
  while (p != self) {
    n += 1;
    p = p.next;
  }
  return n;
}
function makeknots (p, tension, cycle) {
  tension = tension || 1;

  var knots = [];

  for (var i=0; i<p.length; i++) {
    knots.push({
      x_pt: p[i][0],
      y_pt: p[i][1],
      ltype: mp_open,
      rtype: mp_open,
      ly_pt: tension,
      ry_pt: tension,
      lx_pt: tension,
      rx_pt: tension,
      left_tension: function() { if (!this.ly_pt) this.ly_pt = 1; return this.ly_pt;},
      right_tension: function() { if (!this.ry_pt) this.ry_pt = 1; return this.ry_pt;},
      left_curl: function() { return this.lx_pt || 0;},
      right_curl: function() { return this.rx_pt || 0;},
      set_right_curl: function(x) { this.rx_pt = x || 0;},
      set_left_curl: function(x) { this.lx_pt = x || 0;}
    });
  }
  for (var i=0; i<knots.length; i++) {
    knots[i].next = knots[i+1] || knots[i];
    knots[i].set_right_given = knots[i].set_right_curl;
    knots[i].set_left_given = knots[i].set_left_curl;
    knots[i].right_given = knots[i].right_curl;
    knots[i].left_given = knots[i].left_curl;
  }
  knots[knots.length - 1].next = knots[0];
  if (!cycle) {
    knots[knots.length-1].rtype = mp_endpoint;
    knots[knots.length-1].ltype = mp_curl;
    knots[0].rtype = mp_curl;
  }
  return knots;
}
function body_onload(){
/*
  var all = document.getElementsByTagName("canvas");
  for(let canvas of all) {
    var ctx = canvas.getContext('2d');
    canvas_init(ctx,canvas);
  }; 
*/
}
function img_onload(img){
  var id = img.id;
  var canvas = document.getElementById(""+id+"-canvas");
  if(canvas){
    var ctx = canvas.getContext('2d');
    ctx.d = {};
    ctx.d.type = 'canvas';
    ctx.d.img = img;
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    img.style.visibility = 'hidden';
  }
}
function canvas_onfocusin(canvas){
  var ctx = canvas.getContext('2d');
  var imgid = canvas.getAttribute('data-imgid');
  var form = document.getElementById(imgid+'-form');
  form.style.visibility = 'visible';
}
function canvas_onfocusout(canvas){
}
function form_onsubmit(form){
  var imgid = form.getAttribute('data-imgid');
  var img = document.getElementById(imgid);
  var canvas = document.getElementById(imgid+"-canvas");
  event.preventDefault();
  if(img && img.src){
    if(img.src.startsWith("data:")){
      alert("This is Data URL.");
    }else{
      var url = canvas.toDataURL();    
      var png = new URL(img.src,document.baseURI).pathname;
      fetch(form.action, { method:'post', body: JSON.stringify({data:"MY DATA",png,url}), headers: { "Content-Type": "application/json" } }).then(r => r.text()).then(text => alert(text));
    }
  }
  form.style.visibility = 'hidden';
}
function form_onreset(form){
  var imgid = form.getAttribute('data-imgid');
  var img = document.getElementById(imgid);
  var canvas = document.getElementById(imgid+"-canvas");
  event.preventDefault();
  var ctx = canvas?canvas.getContext('2d'):null;
  if(ctx && ctx.d && ctx.d.img){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(ctx.d.img,0,0,canvas.width,canvas.height);
  }else if(ctx){
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  form.style.visibility = 'hidden';
}
function canvas_onmouseenter(canvas){
  canvas.style.cursor = 'crosshair';
  var ctx = canvas.getContext('2d');
}
function canvas_onmouseleave(canvas){
  var ctx = canvas.getContext("2d");
  canvas.style.cursor = '';
  if(ctx.d && ctx.d.mouseisdown){
    canvas_end(ctx,canvas);
    ctx.d.mouseisdown = 0;
  }
}
function canvas_onmousedown(canvas){
  var ctx = canvas.getContext("2d");
  if(event.button==0){
    ctx.d.posx0 = Math.round((event.clientX-canvas.getBoundingClientRect().x)/canvas.getBoundingClientRect().width*canvas.width);
    ctx.d.posy0 = Math.round((event.clientY-canvas.getBoundingClientRect().y)/canvas.getBoundingClientRect().height*canvas.height);
    ctx.d.posx1 = ctx.d.posx0;
    ctx.d.posy1 = ctx.d.posy0;
    ctx.d.posx2 = ctx.d.posx1;
    ctx.d.posy2 = ctx.d.posy1;
    ctx.d.shiftKey = event.shiftKey;
    ctx.d.altKey   = event.altKey;
    ctx.d.mouseisdown = 1;
    ctx.d.mouseisdragged = 0;
    ctx.d.mousedragcount = 0;
    ctx.d.mouseevent = 'mousedown';
    canvas_start(ctx,canvas);
  }
/*
  if(ctx.d.hitball != ctx.d.hiliteball){
    if(ctx.d.hiliteball){
      let i = ctx.d.balls.indexOf(ctx.d.hiliteball);
      if(i >= 0){
        ctx.d.balls.splice(i,1);
        ctx.d.balls.push(ctx.d.hiliteball);
      }
    }
    ctx.d.hitball = ctx.d.hiliteball;
  }
*/
  canvas_redraw(ctx,canvas);
}
function canvas_onmousemove(canvas){
  var ctx = canvas.getContext("2d");
  ctx.d.posx1 = ctx.d.posx2;
  ctx.d.posy1 = ctx.d.posy2;
  ctx.d.posx2 = Math.round((event.clientX-canvas.getBoundingClientRect().x)/canvas.getBoundingClientRect().width*canvas.width);
  ctx.d.posy2 = Math.round((event.clientY-canvas.getBoundingClientRect().y)/canvas.getBoundingClientRect().height*canvas.height);
  ctx.d.shiftKey = event.shiftKey;
  ctx.d.altKey   = event.altKey;
  ctx.d.mouseevent = 'mousemove';
  if(event.button==0 && ctx.d && ctx.d.mouseisdown){
    ctx.d.mouseisdragged = 1;
    ctx.d.mousedragcount += 1;
    canvas_drag(ctx,canvas);
  }else{
    ctx.d.mouseisdragged = 0;
    canvas_move(ctx,canvas);
  }
}
function canvas_onmouseup(canvas){
  var ctx = canvas.getContext("2d");
  ctx.d.mouseevent = 'mouseup';
  if(event.button==0 && ctx.d && ctx.d.mouseisdown){
    canvas_end(ctx,canvas);
    ctx.d.mouseisdown = 0;
    ctx.d.mouseisdragged = 0;
    ctx.d.mousedragcount = 0;
  }else{
  }
  if(event.button!=0){
    event.preventDefault();
  }
  if(ctx.d.hiliteball){
    //ctx.d.hiliteball has been assigned during canvas draw when mouse is down
    //place the hiliteball at the top
    let i = ctx.d.balls.indexOf(ctx.d.hiliteball);
    if(i >= 0){
      ctx.d.balls.splice(i,1);
      ctx.d.balls.push(ctx.d.hiliteball);
    }
  }
  ctx.d.hitball = ctx.d.hiliteball;
  canvas_redraw(ctx,canvas);
}
function canvas_ontouchstart() {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                             
    var ctx = canvas.getContext("2d");
    ctx.d.posx0 = Math.round((event.clientX-canvas.getBoundingClientRect().x)/canvas.getBoundingClientRect().width*canvas.width);
    ctx.d.posy0 = Math.round((event.clientY-canvas.getBoundingClientRect().y)/canvas.getBoundingClientRect().height*canvas.height);
    ctx.d.posx1 = ctx.d.posx0;
    ctx.d.posy1 = ctx.d.posy0;
    ctx.d.posx2 = ctx.d.posx1;
    ctx.d.posy2 = ctx.d.posy1;
    ctx.d.mouseisdown = 1;
    ctx.d.shiftKey = evt.shiftKey;
    ctx.d.altKey   = evt.altKey;
    if(ctx.d.mouseisdown){
      ctx.d.mouseisdragged = 0;
      ctx.d.mousedragcount = 0;
      canvas_start(ctx,canvas);
    }
  }
}
function canvas_ontouchmove(canvas) {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                            
    var ctx = canvas.getContext("2d");
    ctx.d.posx1 = ctx.d.posx2;
    ctx.d.posy1 = ctx.d.posy2;
    ctx.d.posx2 = Math.round((event.clientX-canvas.getBoundingClientRect().x)/canvas.getBoundingClientRect().width*canvas.width);
    ctx.d.posy2 = Math.round((event.clientY-canvas.getBoundingClientRect().y)/canvas.getBoundingClientRect().height*canvas.height);
    ctx.d.shiftKey = evt.shiftKey;
    ctx.d.altKey   = evt.altKey;
    if(ctx.d.mouseisdown){
      ctx.d.mouseisdragged = 1;
      ctx.d.mousedragcount += 1;
      canvas_drag(ctx,canvas);
    }else{
      canvas_move(ctx,canvas);
    }
  }
}
function canvas_ontouchend(canvas) {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                            
    var ctx = canvas.getContext("2d");
    if(ctx.d.mouseisdown){
      canvas_end(ctx,canvas);
      ctx.d.mouseisdragged = 0;
      ctx.d.mousedragcount = 0;
    }
    ctx.d.mouseisdown = 0;
    ctx.d.shiftKey = 0;
    ctx.d.altKey   = 0;
  }
}
function canvas_ontouchcancel(canvas) {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                            
    var ctx = canvas.getContext("2d");
    if(ctx.d.mouseisdown){
      canvas_end(ctx,canvas);
      ctx.d.mouseisdragged = 0;
      ctx.d.mousedragcount = 0;
    }
    ctx.d.mouseisdown = 0;
    ctx.d.shiftKey = 0;
    ctx.d.altKey   = 0;
  }
}
function canvas_onkeydown(canvas){
  var ctx = canvas.getContext('2d');
  switch(event.keyCode){
    case 71://'g' key
      if(ctx.d.hitball){
        ctx.d.moveflag = 1;
        ctx.d.movedistx = 0;
        ctx.d.movedisty = 0;
        ctx.d.initmousex = ctx.d.posx2;
        ctx.d.initmousey = ctx.d.posy2;
      }
      break;
    case 82://'r' key
      if(ctx.d.hitball){
        ctx.d.rotateflag = 1;
        ctx.d.rotateangle = 0;
        ctx.d.initmousex = ctx.d.posx2;
        ctx.d.initmousey = ctx.d.posy2;
        ctx.d.downmousex = ctx.d.posx0;
        ctx.d.downmousey = ctx.d.posy0;
      }
      break;
    case 83://'s' key
      break;
    case 27://'ESC' key
      ctx.d.moveflag = 0;
      ctx.d.movedistx = 0;
      ctx.d.movedisty = 0;
      ctx.d.rotateflag = 0;
      ctx.d.rotateangle = 0;
      ctx.d.hit_transform = null;
      break;
  } 
  canvas_redraw(ctx,canvas);
}
function canvas_start(ctx,canvas){
  if(ctx.d.type=='canvas'){
    ctx.d.s = ctx.getImageData(0,0, canvas.width,canvas.height);
    ctx.d.hobby_p = [];
    var x = ctx.d.posx0;
    var y = ctx.d.posy0;
    ctx.d.hobby_p.push([x,y]);
    canvas_redraw(ctx,canvas);
  }
  if(ctx.d.type=='ball'){
    ctx.d.moveflag = 0;
    ctx.d.movedistx = 0;
    ctx.d.movedisty = 0;
    ctx.d.rotateflag = 0;
    ctx.d.rotateangle = 0;
    if(ctx.d.hit_transform && ctx.d.hitball){
      ctx.d.hitball.transform[0] = ctx.d.hit_transform[0];
      ctx.d.hitball.transform[1] = ctx.d.hit_transform[1];
      ctx.d.hitball.transform[2] = ctx.d.hit_transform[2];
      ctx.d.hitball.transform[3] = ctx.d.hit_transform[3];
      ctx.d.hitball.transform[4] = ctx.d.hit_transform[4];
      ctx.d.hitball.transform[5] = ctx.d.hit_transform[5];
    }
    ctx.d.hit_transform = null;
    canvas_redraw(ctx,canvas);
  }
}
function canvas_move(ctx,canvas){
  if(ctx.d && ctx.d.type=='ball'){
    if(ctx.d.moveflag){
      ctx.d.movedistx = ctx.d.posx2 - ctx.d.initmousex;
      ctx.d.movedisty = ctx.d.posy2 - ctx.d.initmousey;
      canvas_redraw(ctx,canvas);
    }
    if(ctx.d.rotateflag){
      //ctx.d.rotateangle = Math.atan2(ctx.d.posx2-ctx.d.posx0, ctx.d.posy2-ctx.d.posy0);
      let initmousex = ctx.d.initmousex;
      let initmousey = ctx.d.initmousey;
      let downmousex = ctx.d.downmousex;
      let downmousey = ctx.d.downmousey;
      let currmousex = ctx.d.posx2;       
      let currmousey = ctx.d.posy2;       
      let angle0 = Math.atan2(initmousey-downmousey,initmousex-downmousex);
      let angle1 = Math.atan2(currmousey-downmousey,currmousex-downmousex);
      ctx.d.rotateangle = angle1-angle0;
      canvas_redraw(ctx,canvas);
    }
  }
}
function canvas_drag(ctx,canvas){
  if(ctx.d){
    if(ctx.d.type=='ball'){
    }else if(ctx.d.type=='canvas'){
      if(ctx.d.shiftKey&&ctx.d.altKey){
        ctx.d.drift = 1;                
        canvas_redraw(ctx,canvas);
      }else if(ctx.d.shiftKey){ 
        ctx.d.eraser = 1;                
        canvas_redraw(ctx,canvas);
      }else if(ctx.d.altKey){
        ctx.d.smudge = 1;                
        canvas_redraw(ctx,canvas);
      }else{
        ctx.d.pencil = 1;                
        canvas_redraw(ctx,canvas);
      }
    }
  }
}
function canvas_end(ctx,canvas){
}
function canvas_init(ctx,canvas){
  ctx.d = {};
  var unit = parseFloat(canvas.getAttribute('data-unit'));
  var type = canvas.getAttribute('data-type');
  ctx.d.type = type;
  ctx.d.img = null;
  if(type=='canvas'){
    var imgid = canvas.getAttribute('data-imgid');
    var img = document.getElementById(imgid);
    if(img){
      ctx.d.img = img;
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
    }
  }else if(type=='ball'){
    ctx.d.balls = [];
    ctx.d.hitball = null;
    ctx.d.hiliteball = null;
    ctx.d.moveflag = 0;
    var databall = canvas.getAttribute('data-ball');
    var ss = databall.split(',');
    ss.forEach(s => {
      let [type,val] = s.split(':').map(s => s.trim());
      let MM_TO_PX = 3.7795296;
      if(type=='rect'){
        let [x,y,w,h] = val.split(' ').map(s => s.trim()).map(s => parseFloat(s)).map(s => s*unit*MM_TO_PX);
        let cx = w/2;
        let cy = h/2;
        let points = [];
        let transform = [1,0,0,1,0,0];
        let ball = {points,transform,type,cx,cy};
        ctx.d.balls.push(ball); 
        points.push({op:'M',x1:x,y1:y});
        points.push({op:'L',x1:x+w,y1:y});
        points.push({op:'L',x1:x+w,y1:y+h});
        points.push({op:'L',x1:x,y1:y+h});
        points.push({op:'z'});
      }else if(type=='circle'){
        let [cx,cy,r] = val.split(' ').map(s => s.trim()).map(s => parseFloat(s)).map(s => s*unit*MM_TO_PX);
        let points = [];
        let transform = [1,0,0,1,0,0];
        let ball = {points,transform,type,cx,cy};
        ctx.d.balls.push(ball); 
        points.push({op:'e',x1:cx,y1:cy,r,ry:r,rotation:0,sAngle:0,eAngle:Math.PI*2,anticlockflag:0});
        points.push({op:'z'});
      }else if(type=='triangle'){
        let [x1,y1,x2,y2,x3,y3] = val.split(' ').map(s => s.trim()).map(s => parseFloat(s)).map(s => s*unit*MM_TO_PX);
        let cx = (x1+x2+x3)/3;
        let cy = (y1+y2+y3)/3;
        let points = [];
        let transform = [1,0,0,1,0,0];
        let ball = {points,transform,type,cx,cy};
        ctx.d.balls.push(ball); 
        points.push({op:'M',x1:x1,y1:y1});
        points.push({op:'L',x1:x2,y1:y2});
        points.push({op:'L',x1:x3,y1:y3});
        points.push({op:'z'});
      }
    });
    if(0){
      var points = [];
      var transform = [1,0,0,1,0,0];
      var type = 'rect';
      var cx = 10;
      var cy = 10;
      var ball = {points,transform,type,cx,cy};
      ctx.d.balls.push(ball); 
      points.push({op:'M',x1:0,y1:0});
      points.push({op:'L',x1:20,y1:0});
      points.push({op:'L',x1:20,y1:20});
      points.push({op:'L',x1:0,y1:20});
      points.push({op:'z'});
    }
  }
  canvas_redraw(ctx,canvas);
}
function canvas_redraw(ctx,canvas){
  if(ctx.d.type=='ball'){
    canvas_draw_ball(ctx,canvas);
  }else if(ctx.d.type=='canvas'){
    if(ctx.d.drift){ 
      canvas_draw_drift(ctx,canvas);
      ctx.d.drift = 0;
    }else if(ctx.d.eraser){ 
      canvas_draw_eraser(ctx,canvas);
      ctx.d.eraser = 0;
    }else if(ctx.d.smudge){
      canvas_draw_smudge(ctx,canvas);
      ctx.d.smudge = 0;
    }else if(ctx.d.pencil){
      canvas_draw_pencil(ctx,canvas);
      ctx.d.pencil = 0;
    }
  }
}
function canvas_is_visible(ctx,canvas){
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  return(palette.style.visibility == 'visible');
}
function canvas_draw_drift(ctx,canvas){
  var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
  var dx = ctx.d.posx2-ctx.d.posx1;
  var dy = ctx.d.posy2-ctx.d.posy1;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.putImageData(imgdata,dx,dy);
}
function canvas_draw_eraser(ctx,canvas){
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = 8;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(ctx.d.posx1,ctx.d.posy1);
  ctx.lineTo(ctx.d.posx2,ctx.d.posy2);
  ctx.stroke();
  ctx.restore();
} 
function canvas_draw_pencil(ctx,canvas){
  var colorinputid = canvas.getAttribute('data-colorinputid');
  var colorinput = document.getElementById(colorinputid);
  ctx.lineCap = 'round';
  ctx.lineWidth = 1;
  ctx.strokeStyle = colorinput.value;  
  // ctx.beginPath();
  // ctx.moveTo(ctx.d.posx1,ctx.d.posy1);
  // ctx.lineTo(ctx.d.posx2,ctx.d.posy2);
  // ctx.stroke();
  var x = ctx.d.posx2;
  var y = ctx.d.posy2;
  ctx.d.hobby_p.push([x,y]);
  var tension = 1;
  var knots = makeknots(ctx.d.hobby_p, tension, false);
  mp_make_choices(knots[0]);
  ctx.putImageData(ctx.d.s,0,0);
  ctx.beginPath();
  ctx.moveTo(knots[0].x_pt,knots[0].y_pt);
  for (var i=1; i<knots.length-1; i++) {
    // console.log('bezierCurveTo', knots[i-1].rx_pt.toFixed(2), knots[i-1].ry_pt.toFixed(2) ,   knots[i].lx_pt.toFixed(2), knots[i].ly_pt.toFixed(2),  knots[i].x_pt.toFixed(2),  knots[i].y_pt.toFixed(2));
    ctx.bezierCurveTo(
      knots[i-1].rx_pt.toFixed(2), knots[i-1].ry_pt.toFixed(2),
      knots[i].lx_pt.toFixed(2), knots[i].ly_pt.toFixed(2),
      knots[i].x_pt.toFixed(2),  knots[i].y_pt.toFixed(2));
  }
  ctx.stroke();
}
function canvas_draw_smudge(ctx,canvas){
  var colorinputid = canvas.getAttribute('data-colorinputid');
  var colorinput = document.getElementById(colorinputid);
  var value = colorinput.value;//it is in the form of '#476fc7'
  var hexc = value.slice(1);
  if(1){
    let r = '0x' + hexc.substr(0,2);
    let g = '0x' + hexc.substr(2,2);
    let b = '0x' + hexc.substr(4,2);
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);
    var mysmear=[r,g,b];
  }
  do_smudge_between(ctx.d.posx1,ctx.d.posy1,ctx.d.posx2,ctx.d.posy2,5,mysmear,ctx,canvas);
}
function do_smudge_between(posx0,posy0,posx,posy,lw,mysmear,ctx,canvas){
  let dx = posx-posx0;
  let dy = posy-posy0;
  let Dx = Math.abs(dx);
  let Dy = Math.abs(dy);
  if(Dx==0&&Dy==0){
    var n = 1;
  }else if((Dx)>(Dy)){
    var n = Math.ceil(Dx/lw);
  }else{
    var n = Math.ceil(Dy/lw);
  }
  n = Math.max(1,n);
  dx /= n;
  dy /= n;
  for(i=0; i <= n; ++i){
    let x = posx0 + dx*i;
    let y = posy0 + dy*i;
    do_smudge_rect(x-(lw/2),y-(lw/2),lw,lw,mysmear,ctx,canvas);
  }
}
function do_smudge_rect(x,y,w,h,mysmear,ctx,canvas){
  ///RETURN the total number of pixels colored
  var count = 0;
  if(w && h){
    if(w < 0){
      x += w;
      w = -w;
    }
    if(h < 0){
      y += h;
      h = -h;
    }
    var width = canvas.width;
    var height = canvas.height;
    if(x >= 0 && y >= 0 && x < width && y < height){
      var idata = ctx.getImageData(x,y,w,h);
      const cutoff = 64;
      for(let i=0; i < idata.data.length; i+=4){
        if(idata.data[i+3]<=cutoff){
          var rand1 = 0.5+Math.random()*0.5;
          var rand2 = 0.5+Math.random()*0.5;
          idata.data[i+0] = mysmear[0];
          idata.data[i+1] = mysmear[1];
          idata.data[i+2] = mysmear[2];
          idata.data[i+3] = rand2*cutoff;
          count++;
        }
      }
      ctx.putImageData(idata,x,y);
    }
  }
  return count;
}
function resizeImageData(odata,iwidth,iheight,ctx) {
  var owidth = odata.width;
  var oheight = odata.height;
  var idata = ctx.createImageData(iwidth, iheight);
  for(var row = 0; row < iheight; row++) {
    for(var col = 0; col < iwidth; col++) {
      let i = row*iwidth + col;
      let ROW = Math.floor(row*(oheight/iheight));
      let COL = Math.floor(col*(owidth/iwidth));
      let I = ROW*owidth + COL;
      idata.data[i*4 + 0] = odata.data[I*4 + 0];
      idata.data[i*4 + 1] = odata.data[I*4 + 1];
      idata.data[i*4 + 2] = odata.data[I*4 + 2];
      idata.data[i*4 + 3] = odata.data[I*4 + 3];
    }
  }
  return idata;
}
function canvas_onplus(button){
  var imgid = button.getAttribute('data-imgid');
  var canvas = document.getElementById(imgid+"-canvas");
  var ctx = canvas.getContext('2d');
  var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
  var imgdata = resizeImageData(imgdata,canvas.width+10,canvas.height+(canvas.height/canvas.width)*10,ctx);
  ctx.putImageData(imgdata,0,0);
}
function canvas_onminus(button){
  var imgid = button.getAttribute('data-imgid');
  var canvas = document.getElementById(imgid+"-canvas");
  var ctx = canvas.getContext('2d');
  var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
  var imgdata = resizeImageData(imgdata,canvas.width-10,canvas.height-(canvas.height/canvas.width)*10,ctx);
  ctx.putImageData(imgdata,0,0);
}
function canvas_oncolorchange(input){
  var imgid = input.getAttribute('data-imgid');
  var canvas = document.getElementById(imgid+"-canvas");
  var ctx = canvas.getContext('2d');
  if(ctx.d){
    ctx.d.color = input.value;
  }
}
function canvas_draw_ball(ctx,canvas){
  var hiliteball = null;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.d.balls.forEach((ball) => {
    ctx.save();
    ctx.lineWidth=2;
    ctx.lineJoin='round';
    ctx.lineCap='round';
    let [a,b,c,d,e,f] = ball.transform;
    ctx.setTransform(a,b,c,d,e,f);
    if(ctx.d.hitball==ball && ctx.d.rotateflag){
      ctx.translate(ball.cx,ball.cy);
      ctx.rotate(ctx.d.rotateangle);
      ctx.translate(-ball.cx,-ball.cy);
    }
    if(ctx.d.hitball==ball && ctx.d.moveflag){
      let matrix = ctx.getTransform();
      let a = matrix.a;
      let b = matrix.b;
      let c = matrix.c;
      let d = matrix.d;
      let e = matrix.e;
      let f = matrix.f;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.translate(ctx.d.movedistx,ctx.d.movedisty);
      ctx.transform(a,b,c,d,e,f);
    }
    if(ctx.d.hitball==ball && (ctx.d.moveflag||ctx.d.rotateflag)){
      let matrix = ctx.getTransform();
      let a = matrix.a;
      let b = matrix.b;
      let c = matrix.c;
      let d = matrix.d;
      let e = matrix.e;
      let f = matrix.f;
      ctx.d.hit_transform = [a,b,c,d,e,f];
    }
    ctx.beginPath();
    ball.points.forEach((pt) => {
      let {op,x,y,cp1x,cp1y,cp2x,cp2y,x1,y1,x2,y2,r,ry,sAngle,eAngle,anticlockflag} = pt;
      switch(op){
        case 'M':
          ctx.moveTo(x1,y1);
          break;
        case 'L':
          ctx.lineTo(x1,y1);
          break;
        case 'A':
          ctx.arcTo(x1,y1,x2,y2,r);
          break;
        case 'a':
          ctx.arc(x1,y1,r,sAngle,eAngle,anticlockflag);
          break;
        case 'e':
          var rotation = 0;
          ctx.ellipse(x1,y1,r,ry,rotation,sAngle,eAngle,anticlockflag);
          break;
        case 'z':
          ctx.closePath();
          break;
      }
    });
    if(ctx.d.view_mode=='solid'){                   
      var hitflag = ctx.isPointInPath(ctx.d.posx2,ctx.d.posy2);
    }else{
      var hitflag = ctx.isPointInStroke(ctx.d.posx2,ctx.d.posy2);
    }
    if(hitflag){
      hiliteball = ball;
    }
    if(ctx.d.hitball==ball){
      ctx.strokeStyle = '#1010B0';
      ctx.stroke();
    }else if(ctx.d.downball===ball){
      ctx.strokeStyle = '#1010B0';
      ctx.stroke();
    }else{
      ctx.stroke();
    }
    ctx.restore();
  });
  ctx.d.hiliteball = hiliteball;
}
`;
var stylesheet = `\
:root {
  --titlecolor: #1010B0;
  --myimg: url("${myimg}");
}
.TH, .TD{ 
  padding: 0.215em 0.4252em;
}
.UL.ITEMIZE{
  list-style-type: square;
  list-style-image: var(--myimg);
}
.BODY{
  margin: 2.5pt 0pt;
}
.EXAMPLE{
  margin: 2.5pt 0pt;
}
.VERBATIM{
  margin: 2.5pt 0pt;
}
.RECORD{
  margin: 2.5pt 0pt;
}
.FLUSHLEFT{
  margin: 2.5pt 0pt;
}
.CENTER{
  margin: 2.5pt 0pt;
}
.PRIMARY{
  margin: 2.5pt 0pt;
}
.SECONDARY{
  margin: 2.5pt 0pt;
}
.EQUATION{
  margin: 2.5pt 0pt;
}
.FIGURE{
  margin: 2.5pt 0pt;
}
.LISTING{
  margin: 2.5pt 0pt;
}
.TABLE{
  margin: 2.5pt 0pt;
}
.COLUMNS{
  margin: 2.5pt 0pt;
}
.LINES{
  margin: 2.5pt 0pt;
}
.ITEMIZE{
  margin: 2.5pt 0pt;
}
.TITLE {
  margin-left: -6mm;
  margin-right: -6mm;
  margin-top: 1mm;
  margin-bottom: 0;
  font-size:1.30em;
  font-weight: 500;
  color: var(--titlecolor);
}
.TITLE2 {
  margin-left: -6mm;
  margin-right: -6mm;
  margin-top: 0;
  margin-bottom: 0;
  font-size:0.8em;
  font-weight: 500;
  color: var(--titlecolor);
}
.FRONTMATTERTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 25mm;
  margin-bottom: 0;
  font-size: 1.8em;
  color: var(--titlecolor);
  text-align: center;
  align-self: center;
}
.FRONTMATTERSUBTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 2mm;
  margin-bottom: 6mm;
  font-size: 1.0em;
  color: var(--titlecolor);
  text-align: center;
  align-self: center;
}
.FRONTMATTERINSTITUTE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERAUTHOR {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
.FRONTMATTERDATE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.2cm;
  margin-bottom: 0;
  font-size: 1.1em;
  text-align: center;
  align-self: center;
}
@media print {
  @page {
    size: 128mm 96mm;
    margin: 0 0 0 0;
  }  
  .SLIDE {
    color: black;
    position: relative;
    page-break-inside: avoid;
    page-break-after: always;
    min-width:100vw;
    max-width:100vw;
    min-height:100vh;
    max-height:100vh;
    box-sizing:border-box;
    overflow: hidden;
    padding:1px 10mm;
  }
  body {
    margin:0;
    padding:0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.25;
  }
}
@media screen {
  .SLIDE {
    color: black;
    position: relative;
    background-color: white;
    margin: 1em auto;
    min-width:128mm;
    max-width:128mm;
    min-height:96mm;
    max-height:96mm;
    box-sizing:border-box;
    overflow: hidden;
    padding:1px 10mm;
  }
  body {
    background-color: gray;
    box-sizing:border-box;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.25;
    margin:0;
    padding:1px 0;
  }
}
`;

class NitrilePreviewSlide extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.style = parser.style;
    this.icon_writinghand = '&#x2020;'//DAGGER        
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.vw = 482;//px
    this.vh = 362;//px
  }
  to_peek_document() {
    var title_html = this.to_titlepage();
    var html = this.to_beamer();
    return `${title_html}\n${html}`;
  }
  to_script(){
    return script;///global variable
  }
  to_data() {
    var title_html = this.to_titlepage();
    var title = this.uncode(this.parser.style,this.parser.title);
    var html = this.to_beamer();
    var body = `${title_html}\n${html}`;
    var script = this.to_script();
    var members = this.parser.members;
    return {stylesheet,script,body,members,title};
  }
  to_xhtml() {
    var data = this.to_data();
    var all = [];
    all.push(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">`);
    all.push(`<html xmlns='http://www.w3.org/1999/xhtml'>`);
    all.push(`<head>`);
    all.push(`<meta http-equiv='default-style' content='text/html' charset='utf-8'/>`);
    all.push(`<title> ${this.title} </title>`);
    all.push(`<script>`);
    all.push(`//<![CDATA[`);
    all.push(`${data.script}`);
    all.push(`//]]>`);
    all.push(`</script>`);
    all.push(`<style>`);
    all.push(`${data.stylesheet}`);
    all.push(`</style>`);
    all.push(`</head>`);
    all.push(`<body onload="body_onload()">`);
    all.push(`${data.body}`);
    all.push(`</body>`);
    all.push(`</html>`);
    return all.join('\n');
  }
  to_beamer() {
    var presentation = new NitrilePreviewPresentation();
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,j,arr) => {
      let topframe = presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          ///note that each subsection is just a 'blocks'
          let subframe = presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let id = `${j+1}`;
        let out = this.write_frame_folder(id,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,k) => {
          let subid = `${k+1}`;
          let out = this.write_one_frame(id,subid,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${j+1}`;
        let subid = ``;
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    if(this.parser.tocpage){
      var toc = this.write_frame_toc(topframes);
    }else{
      var toc = '';
    }
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d.join('\n');
  }
  write_frame_toc(topframes){
    /// decide if we need to change fonts
    var all = [];
    var n = 0;
    var max_n = 16;
    var css_title = this.css('TITLE');
    var css_title2 = this.css('TITLE2');
    var css_ol = this.css('OL');
    topframes.forEach((topframe,j,arr) => {
      if(n==max_n){
        all.push(`</ul>`);
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      if(n==0){
        all.push(`<article data-row='0' class='SLIDE'>`);
        all.push(`<h1 class='TITLE'  style='${css_title}' > Table Of Contents </h1>`);
        all.push(`<h2 class='TITLE2' style='${css_title2}' > &#160; </h2>`);
        all.push(`<ul class='OL'     style='${css_ol};padding-left:2.0em;list-style-type:none;position:relative;' >`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let order = j+1;
      all.push(`<li style='position:relative;' > <span style='position:absolute;left:-2.0em;' > ${order} </span> <a style='color:inherit' href='#frame${j+1}'> ${this.uncode(topframe.style,topframe.title)} </a> </li>`);
      n++;
    });
    all.push(`</ul>`);
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_frame_folder(id,frame,subframes){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    all.push(`<h1 class='TITLE'    style='${css_title}' > ${id} ${this.uncode(frame.style,frame.title)} </h1>`);
    all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
    frame.contents.forEach((x) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    if(1){
      // subframes
      all.push(`<ul style='list-style:none;padding-left:0em;position:relative;'>`);
      subframes.forEach((subframe,k,arr) => {
        all.push(`<li style='position:relative;font-decoration:underline;'> <span style='position:absolute;left:-2em' > </span> <a style='color:inherit' href='#frame${id}.${k+1}'> ${id}.${k+1} ${this.uncode(subframe.style,subframe.title)} </a> </li>`);
      });
      all.push(`</ul>`);
      all.push('</article>');
      all.push('');
    }
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  write_one_frame(id,subid,frame,issub,topframe){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='display:flex;flex-direction:column;' >`);
    if(subid){
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${id} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle};text-decoration:underline' > ${id}.${subid} ${this.uncode(frame.style,frame.title)} </h2>`);
    }else{
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${id} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
    }
    //
    //NOTE: check double-column-layout
    //
    var x1 = null 
    var xs2 = [];
    if(frame.contents.length && frame.contents[0].id=='figure' && frame.contents[0].style.wrapfig){
      x1 = frame.contents.shift();
    }
    var text1 = '';
    var text2 = '';
    if(x1){
      let bundles = this.body_to_all_bundles(x1.style,x1.body,x1.bodyrow);
      let bundle = bundles[0];
      if(bundle){
        let itm = this.do_bundle(x1.style,bundle);
        if(itm.img){
          text1 = itm.img;
        }else if(itm.tab){
          text1 = itm.tab;
        }
      }
    }
    if(1){
      let all = [];
      frame.contents.forEach((x,i) => {
        ///'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      })
      frame.solutions.forEach((o,i,arr) => {
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(`<div class='BODY' style='${this.css("BODY")}' > ${this.icon_writinghand} <i>${this.uncode(o.style,o.title)}</i> ${text} </div>`);
        }else{
          all.push(`<div class='BODY' style='${this.css("BODY")}' > ${this.icon_writinghand} <i>${this.uncode(o.style,o.title)}</i> </div>`);
        }
      });
      var text2 = all.join('\n');
    }
    if(text1){
      all.push('<div style="column-count:2;flex:1;">');
      all.push('<div style="break-after:column;display:flex;flex-direction:column;justify-content:center;min-height:280px;">');
      all.push(text2);
      all.push('</div>');
      all.push(`<div style="display:flex;flex-direction:column;justify-content:center;min-height:280px;">`);
      all.push(text1);
      all.push('</div>')
      all.push('</div>');
    }else{
      all.push(`<div style="display:flex;flex-direction:column;justify-content:center;min-height:280px;">`);
      all.push(text2);
      all.push('</div>')
    }
    //
    //NOTE: board name
    //
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      all.push(`<article class='SLIDE' style='display:flex;flex-direction:column;' data-row='${o.style.row}'>`);
      all.push(`<h1 class='TITLE' style='${css_title}' > &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_writinghand;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_writinghand;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
      }
      o.contents.forEach((x) => {
        //'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      });
      all.push('</article>');
      all.push('');
    })
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlepage(){
    let title     = this.parser.conf_to_string('title','Untitled');
    let subtitle  = this.parser.conf_to_string('subtitle')
    let institute = this.parser.conf_to_string('institute');
    let author    = this.parser.conf_to_string('author');
    var date      = new Date().toLocaleDateString();
    let data = `<article data-row='0' class='SLIDE'>
    <div class='FRONTMATTERTITLE'     style='${this.css("FRONTMATTERTITLE")}' >${this.smooth(this.style,title)}</div>
    <div class='FRONTMATTERSUBTITLE'  style='${this.css("FRONTMATTERSUBTITLE")}' >${this.smooth(this.style,subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.smooth(this.style,institute)}</div>
    <div class='FRONTMATTERAUTHOR'    style='${this.css("FRONTMATTERAUTHOR")}' >${this.smooth(this.style,author)}</div>
    <div class='FRONTMATTERDATE'      style='${this.css("FRONTMATTERDATE")}' >${this.smooth(this.style,date)}</div>
    </article>
    `;
    return data;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    all.push(`<ul style='margin-top:0;margin-bottom:0;list-style:none; padding:0;'>`);
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`<li> ${this.uchar_checkboxx} ${this.uncode(style,s)} </li>`)
      }else{
        all.push(`<li> ${this.uchar_checkboxo} ${this.uncode(style,s)} </li>`)
      }
    })
    all.push(`</ul>`)
    return all.join('\n')
  }
  to_fontsize(length){
    var fontsize = '';
    if( length > 16 ){
      fontsize = '90%';
    }
    if( length > 18 ){
      fontsize = '80%';
    }
    if( length > 20 ){
      fontsize = '70%';
    }
    if( length > 24 ){
      fontsize = '60%';
    }
    return fontsize;
  }
}
////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////
class NitrilePreviewBeamer extends NitrilePreviewLatex {
  constructor(parser) {
    super(parser);
    this.name = 'beamer';
    this.frames = 0;
    this.frameid = 0;
    this.frameopt = '';
    this.eid = 0; //exercise ID
    this.style = parser.style;
    this.parskip = 0;
    this.icon_checkedbox = `{$\\blacksquare$}`;
    this.icon_hollowbox = `{$\\square$}`;
    this.icon_writinghand = '{\\dag}';
  }
  to_document() {
    var bodylines = this.to_bodylines();
    var titlelines = this.to_titlelines();
    var titlepagelines = this.to_titlepagelines();
    var data_pdflatex = `\
% !TEX program = PdfLatex 
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_pdflatex()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{courier}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usepackage{parskip}
\\usepackage{tikzsymbols}%Coffeecup
\\setlength\\belowcaptionskip{-8pt}
\\begin{document}
${titlepagelines.join('\n')}
${bodylines.join('\n')}
\\end{document}
`;
    var data_xelatex = `\
% !TEX program = XeLatex
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_xelatex()}
\\usepackage{parskip}
\\setlength\\belowcaptionskip{-8pt}
${titlelines.join('\n')}
\\XeTeXlinebreaklocale "zh"
\\XeTeXlinebreakskip = 0pt plus 1pt
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    var data_lualatex = `\
% !TEX program = LuaLatex
\\documentclass[10pt]{beamer}
${this.to_preamble_essentials_lualatex()}
\\usepackage{parskip}
\\setlength\\belowcaptionskip{-8pt}
${titlelines.join('\n')}
\\begin{document}
\\maketitle
${bodylines.join('\n')}
\\end{document}
`;
    if(this.parser.tex=='lualatex'){
      return data_lualatex;
    }else if(this.parser.tex=='xelatex'){
      return data_xelatex;
    }else{
      return data_pdflatex;
    }
  }
  to_bodylines() {
    var presentation = new NitrilePreviewPresentation(this);
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,j,arr) => {
      let topframe = presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let id = `${j+1}`;
        let out = this.write_frame_folder(id,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,k) => {
          let subid = `${k+1}`;
          let out = this.write_one_frame(id,subid,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${j+1}`;
        let subid = ``;
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
        d.push(out);
      }
    });
    var main = d.join('\n');
    //
    //table of contents
    //
    if(this.parser.tocpage){
      var toc = this.write_frame_toc(topframes);
    }else{
      var toc = '';
    }
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d;
  }
  write_frame_toc(topframes){
    let all = [];
    let n = 0;
    let max_n = 16;
    let texts = [];
    topframes.forEach((topframe,i,arr) => {
      if(n==max_n){
        all.push(`\\end{list}`);    
        texts.push(all.join('\n'));
        n = 0;
      }
      if(n==0){
        all = [];
        all.push(`\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{16pt}}`);      
      }
      let title = this.uncode(topframe.style,topframe.title);
      let label = `${i+1}`;
      let icon = this.icon_coffeecup;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`\\item[${label}] ${title}`);
      }else{
        all.push(`\\item[${label}] ${title}`)
      }
      ++n;
      if(i+1==arr.length){
        all.push('\\end{list}');
        texts.push(all.join('\n'));
        all = [];
      }
    });
    ///ASSEMBLE
    // var text = all.join('\n')
    ///ASSEMBLE
    all = [];
    texts.forEach((text) => {
      all.push('');
      all.push(`\\begin{frame}[t]`);
      all.push(`\\frametitle{Table Of Contents}`);    
      all.push(`\\framesubtitle{~}`);
      all.push(text);
      all.push(`\\end{frame}`);
    });
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    var all = [];
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}[t]`)
    all.push(`\\frametitle{${id} ${this.uncode(frame.style,frame.title)}}`); 
    all.push(`\\framesubtitle{~}`);
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    subframes.forEach((subframe,k,arr) => {
      if(k==0){
        all.push('');
        all.push('\\begin{list}{}{\\setlength\\itemsep{0pt}\\setlength\\parsep{0pt}\\setlength\\leftmargin{0pt}}');
      }
      ///'o' is blocks
      all.push(`\\item \\underline{${id}.${k+1} ${this.uncode(subframe.style,subframe.title)}} `);
      if(k+1==arr.length){
        all.push('\\end{list}')
      }
    });  
    all.push(`\\end{frame}`);
    all.push('');
    return all.join('\n')
  }
  write_one_frame(id,subid,frame,issub,topframe) {
    let all = [];
    let v = null;
    // 
    //NOTE: main contents
    //
    all.push(`\\begin{frame}${this.frameopt}`)
    if(issub){
      all.push(`\\frametitle{${id} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{\\footnotesize\\underline{${id}.${subid} ${this.uncode(frame.style,frame.title)}}}`);
    }else{
      all.push(`\\frametitle{${id} ${this.uncode(topframe.style,topframe.title)}}`);    
      all.push(`\\framesubtitle{~}`);
    }
    //
    //NOTE: check to see if the first block is a DIA block with wrapfig:right or wrapfig:left
    //
    var x1 = null 
    var xs2 = [];
    if(frame.contents.length && frame.contents[0].id=='figure' && frame.contents[0].style.wrapfig){
      x1 = frame.contents.shift();
    }
    var text1 = '';
    var all2 = [];
    if(x1){
      let bundles = this.body_to_all_bundles(x1.style,x1.body,x1.bodyrow);
      let bundle = bundles[0];
      if(bundle){
        let itm = this.do_bundle(x1.style,bundle);
        var text1 = '';
        if(itm.img){
          text1 = itm.img;
        }else if(itm.tab){
          text1 = itm.tab;
        }
      }
    }
    if(1){
      let all = [];
      frame.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
        if(text1){//this is needed as when placed inside a column the vertical spaces are squashed
          all.push('');
          all.push('\\smallskip');
        }
      })     
      all.push('');
      frame.solutions.forEach((o,i,arr) => {
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(`${this.icon_writinghand} {${this.uncode(o.style,o.title)}} `);
          all.push(`\\hfill\\break`);
          all.push(text);
        }else{
          all.push(`${this.icon_writinghand} {${this.uncode(o.style,o.title)}} `);
        }
      })
      all2 = all;              
    }
    if(text1){
      all.push('');
      all.push(`\\begin{columns}`);
      all.push(`\\begin{column}{0.5\\textwidth}`);
      all.push(`${all2.join('\n')}`);
      all.push(`\\end{column}`);
      all.push(`\\begin{column}{0.5\\textwidth}`);
      all.push(`${text1}`);
      all.push(`\\end{column}`);
      all.push(`\\end{columns}`);
    }else{
      all.push('');
      all.push(`${all2.join('\n')}`);
    }
    all.push(`\\end{frame}`);
    all.push('');
    //
    //NOTE: individual slides
    //
    frame.solutions.forEach((o,i,arr) => {     
      //solution slides
      let icon = this.icon_writinghand;
      all.push(`\\begin{frame}[t]`);
      if(o.choice){
        var title = this.uncode(o.style,o.title);
        var text = this.to_choice(o.style,o.body,o.choice);
      }else{
        var title = this.uncode(o.style,o.title);
        var text = this.uncode(o.style,this.join_para(o.body));
      }
      all.push(`\\frametitle{~}`);
      all.push(`\\framesubtitle{${icon} ${title} ~ ${text}}`);
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })
      all.push(`\\end{frame}`);
      all.push('');
    });
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlelines(){
    var titlelines = [];
    var title      = this.parser.conf_to_string('title');
    var subtitle   = this.parser.conf_to_string('subtitle');
    var author     = this.parser.conf_to_string('author');
    var institute  = this.parser.conf_to_string('institute')
    title = this.smooth(this.style,title);
    subtitle = this.smooth(this.style,subtitle);
    author = this.smooth(this.style,author);
    institute = this.smooth(this.style,institute);
    titlelines.push(`\\title{${title}}`);
    titlelines.push(`\\subtitle{${subtitle}}`);
    titlelines.push(`\\institute{${institute}}`);
    titlelines.push(`\\author{${author}}`);
    return titlelines;
  }
  to_titlepagelines(){
    var titlelines = [];
    var title      = this.parser.conf_to_string('title');
    var subtitle   = this.parser.conf_to_string('subtitle');
    var author     = this.parser.conf_to_string('author');
    var institute  = this.parser.conf_to_string('institute')
    var date       = new Date().toLocaleDateString();  
    title = this.smooth(this.style,title);
    subtitle = this.smooth(this.style,subtitle);
    author = this.smooth(this.style,author);
    institute = this.smooth(this.style,institute);
    titlelines.push('');
    titlelines.push(`\\begin{frame}`)
    titlelines.push(`\\frametitle{~}`);
    titlelines.push(`\\framesubtitle{~}`);
    titlelines.push(`\\begin{center}\\Large`);
    titlelines.push(`${title}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\begin{center}`);
    titlelines.push(`${subtitle}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\begin{center}`);
    titlelines.push(`${institute}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\begin{center}`);
    titlelines.push(`${author}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\begin{center}`);
    titlelines.push(`${date}`);
    titlelines.push(`\\end{center}`);
    titlelines.push(`\\end{frame}`)
    return titlelines;
  }
  to_choice(style,body,check){
    body = body.filter((s) => s.length)
    var all = [];
    all.push('\\begingroup')
    all.push(`\\renewcommand{\\arraystretch}{1.1}`);
    all.push('\\begin{tabular}{@{}p{\\linewidth}@{}}');
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    body.forEach((s) => {
      var start;
      if((v=re_word.exec(s))!==null){
        start = v[1];
      }
      if(this.is_in_list(start,checks)){
        all.push(`${this.icon_checkedbox} ${this.uncode(style,s)} \\tabularnewline`)
      }else{
        all.push(`${this.icon_hollowbox} ${this.uncode(style,s)} \\tabularnewline`)
      }
    })
    all.push('\\end{tabular}');
    all.push('\\endgroup')
    return all.join('\n');  
  }
}
////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////
class NitrilePreviewCreamer extends NitrilePreviewContex {
  constructor(parser) {
    super(parser);
    this.name = 'creamer';
    this.style = parser.style;
    this.frames = 0;
    this.frameid = 0;
    this.icon_writinghand = '{\\symbol[martinvogel 2][Cross]}';
    this.icon_hollowbox = '{\\symbol[martinvogel 2][HollowBox]}'; 
    this.icon_checkedbox = '{\\symbol[martinvogel 2][CheckedBox]}';             
    this.s_ad = String.fromCodePoint(0xAD);
    this.presentation = new NitrilePreviewPresentation(this);
    this.bodyfontsuit = this.assert_string(this.bodyfontsuit,'');
    this.bodyfontvariant = this.assert_string(this.bodyfontvariant,'ss');
    this.bodyfontsize = this.assert_float(this.bodyfontsize,10);
    this.contex_bodylineheight = 1.15;
    this.contex_whitespacesize = 5;
    this.contex_indenting = 'no';
    this.contex_caption_align = 'c';
    this.contex_caption_small = 1;
  }
  to_document() {
    ///process the document
    var body = this.to_body();
    return     `\
% !TEX program = ConTeXt (LuaTeX)
${this.to_preamble_fonts()}
${this.to_preamble_math()}
${this.to_preamble_colors()}
${this.to_preamble_essentials()}
${this.to_preamble_caption()}
${this.to_preamble_definecolors()}
${this.to_preamble_langs()}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\usesymbols[mvs]
%\\definesymbol[1][{\\symbol[martinvogel 1][MVRightArrow]}]
\\definesymbol[1][{\\symbol[text][blacktriangle]}]
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\definepapersize[BEAMER][width=128mm,height=96mm]
\\setuppapersize[BEAMER]                           
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\\enabletrackers[fonts.missing]
\\setuppagenumbering[location={header,right},style=]
\\setuplayout[topspace=2mm,
             header=0mm,
             footer=0mm,
             height=93mm,
             width=108mm,
             backspace=10mm,
             leftmarginwidth=0mm, 
             rightmarginwidth=0mm, 
             leftmargindistance=0mm, 
             rightmargindistance=0mm]
\\definecolor[titleblue][r=0.0627,g=0.0627,b=0.6902]
\\setuphead[part][number=yes]
\\setuphead[chapter][style=bfd,number=yes]
\\setuphead[section][style=tfb,number=no,page=yes,margin=-7mm,color=titleblue,before={},after={}]
\\setuphead[subsection][style=normal,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsection][style=small,number=no,continue=yes,before={},after={}]
\\setuphead[subsubsubsection][style=normal,number=yes]
\\setupcaptions[minwidth=\\textwidth, align=middle, location=top]
\\setupinteraction[state=start,color=,contrastcolor=]
\\placebookmarks[part,chapter,section]
\\setuplines[before={},after={}]
\\setuptabulate[before={},after={}]
\\definelayer[mybg][x=0mm,y=0mm,width=\\paperwidth,height=\\paperheight]
\\setupbackgrounds[page][background=mybg]                               
\\starttext
${body.join('\n')}
\\stoptext
`;
  }
  to_body() {
    let top = this.presentation.to_top(this.parser.blocks);
    ///
    ///Process each section, and within each section the subsections
    ///
    var all_main = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
      let topframe = this.presentation.to_frame(sect.blocks);
      topframes.push(topframe);
      if(sect.sections.length){
        ///
        ///the subframes are build on the fly
        ///
        let subframes = [];
        topframe.subframes = subframes;
        sect.sections.forEach((subblocks) => {
          let subframe = this.presentation.to_frame(subblocks);
          subframes.push(subframe);
        });
        let id = `${i+1}`;
        let out = this.write_frame_folder(id,topframe,subframes);
        all_main.push(out);
        subframes.forEach((subframe,j) => {
          let subid = `${j+1}`;
          let out = this.write_one_frame(id,subid,subframe,1,topframe);
          all_main.push(out);
        });
      }else{
        let id = `${i+1}`;
        let subid = ``;
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
        all_main.push(out);
      }
    });
    var text_main = all_main.join('\n');
    //
    //table of contents
    //
    if(this.parser.tocpage){
      var text_toc = this.write_frame_toc(topframes);
    }else{
      var text_toc = '';
    }
    ///
    ///titlelines
    ///
    var text_titlepage = this.to_titlepage()
    //
    // put together
    //
    var all = [];
    all.push(text_titlepage)
    all.push(text_toc);
    all.push(text_main);
    return all;
  }
  write_frame_toc(topframes){
    let all = [];
    let n = 0;
    var max_n = 16;
    all.push('');
    topframes.forEach((topframe,i,arr) => {
      if(n==max_n){
        all.push(`\\stopitemize`);    
        all.push(`\\stopsection`)
        all.push('');
        n=0;
      }
      if(n==0){
        all.push(`\\startsection[title={Table Of Contents},reference=toc,bookmark={Table Of Contents}]`);
        all.push(`\\godown[+0.40cm]`)
        all.push(`\\startitemize[packed]`);      
      }
      let title = this.uncode(topframe.style,topframe.title);
      let label = `${i+1}`;
      if(topframe.subframes && topframe.subframes.length){
        all.push(`\\sym {${label}} \\goto{${title}}[${label}]`);
      }else{
        all.push(`\\sym {${label}} \\goto{${title}}[${label}]`);
      }
      n++;
    });
    all.push(`\\stopitemize`);    
    all.push(`\\stopsection`)
    all.push('');
    return all.join('\n');
  }
  write_frame_folder(id,frame,subframes){
    let all = [];
    all.push('');
    all.push(`\\startsection[title={${id} ${this.uncode(frame.style,frame.title)}},reference=${id},bookmark={${id}. ${frame.raw}}]`); 
    all.push(`\\godown[+0.40cm]`)
    ///
    ///NOTE: vertical adjustment
    ///
    all.push(`\\godown[-0.02cm]`);
    ///
    ///NOTE: contents
    ///
    frame.contents.forEach((x,i) => {
      //'x' is a block
      let latex = this.translate_block(x);
      all.push('');
      all.push(latex.trim());
    })   
    all.push('');
    all.push('\\startitemize[packed,joinedup]');
    subframes.forEach((subframe,i,arr) => {
      let title = this.uncode(subframe.style,subframe.title);
      let subid = `${i+1}`;
      all.push(`\\sym {\\underbar ${id}.${subid} ${title}}`);
    });  
    all.push(`\\stopitemize`);
    all.push(`\\stopsection`) 
    var text = all.join('\n');
    return text;
  }
  write_one_frame(id,subid,frame,issub,topframe) {
    let all = [];
    let v = null;
    if(1){
      ///
      ///main slide
      ///
      all.push('');
      if(issub){
        all.push(`\\startsection[title={${id} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${id}.${subid} ${frame.raw}}]`); 
        all.push(`\\godown[-0.20cm]`)
        all.push(`\\startsubsubsection[title={{\\underbar ${id}.${subid} ${this.uncode(frame.style,frame.title)}}},reference=,bookmark=]`); 
      }else{
        all.push(`\\startsection[title={${id} ${this.uncode(topframe.style,topframe.title)}},reference=${id},bookmark={${id} ${topframe.raw}}]`); 
        all.push(`\\godown[+0.40cm]`)
      }
      ///
      ///NOTE; adjust vertical
      ///
      all.push(`\\godown[-0.02cm]`);
      ///
      ///NOTE: add \vfill 
      ///
      all.push('\\vfill');
      ///
      ///NOTE: split into two columns
      ///
      var x1 = null 
      var xs2 = [];
      if(frame.contents.length && frame.contents[0].id=='figure' && frame.contents[0].style.wrapfig){
        x1 = frame.contents.shift();
      }
      var text1 = '';
      var text2 = '';
      if(x1){
        let bundles = this.body_to_all_bundles(x1.style,x1.body,x1.bodyrow);
        let bundle = bundles[0];
        if(bundle){
          let itm = this.do_bundle(x1.style,bundle);
          var text1 = '';
          if(itm.img){
            text1 = itm.img;
          }else if(itm.tab){
            text1 = itm.tab;
          }
        }
      }
      if(1){
        let all = [];
        frame.contents.forEach((x,i) => {
          //'x' is a block
          let latex = this.translate_block(x);
          all.push('');
          all.push(latex.trim());
        })     
        frame.solutions.forEach((o,i,arr) => {
          all.push('')
          if(o.choice){
            all.push(`{${this.icon_writinghand}} {\\it ${this.uncode(o.style,o.title)}}\\crlf`);
            let text = this.to_choice(o.style,o.body,'',false);
            all.push(text);
          }else{
            all.push(`{${this.icon_writinghand}} {\\it ${this.uncode(o.style,o.title)}}`);
          }
        })
        var text2 = all.join('\n');
      }
      if(text1){
        all.push(`\\startcolumns[n=2]`);
        all.push(text2);
        all.push(`\\column`);
        all.push(text1);
        all.push(`\\stopcolumns`);
      }else{
        all.push('');
        all.push(text2);
      }
      all.push('\\vfill');
      all.push(`\\stopsection`);
      all.push('');
    }
    ///
    ///solution slides
    ///
    frame.solutions.forEach((o,i,arr) => {     
      all.push('');
      let icon = this.icon_writinghand;
      if(o.choice){
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice,true);
        all.push(`\\page`);//start a new page also make sure that this slide does not appear inside the bookmark section
        all.push(`\\dontleavehmode`);
        all.push(`\\blank[0.5cm]`);
        all.push(`\\startsubsection[title={${icon} {\\it{${title}}} \\small ${text}},reference=,bookmark={${icon} ${title}}]`);//empty 
        //all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }else{
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        all.push(`\\page`);//start a new page also make sure that this slide does not appear inside the bookmark section
        all.push(`\\dontleavehmode`);
        all.push(`\\blank[0.5cm]`);
        all.push(`\\startsubsection[title={${icon} {\\it{${title}}} \\small ${text}},reference=,bookmark={${icon} ${title}}]`);//empty 
        //all.push(`\\startsubsection[title={${text}},bookmark={}]`);
      }
      all.push('');
      o.contents.forEach((x,i) => {
        //'x' is a block
        let latex = this.translate_block(x);
        all.push('');
        all.push(latex.trim());
      })
      all.push(`\\stopsubsection`);
      all.push(`\\stopsection`)
    });
    return all.join('\n');
  }
  to_titlepage(){
    var title      = this.parser.conf_to_string('title','Untitled');
    var subtitle   = this.parser.conf_to_string('subtitle')
    var institute  = this.parser.conf_to_string('institute')
    var author     = this.parser.conf_to_string('author')
    var style      = this.parser.style;
    var date       = new Date().toLocaleDateString();  
    var all = [];
    all.push(`\\dontleavehmode`);
    all.push(`\\blank[2cm]`);
    all.push(`\\startalignment[center]`);
    all.push(`\\tfc \\color[titleblue]{${this.smooth(this.style,title)}} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(this.style,subtitle)} `);
    all.push(`\\blank[1.0cm]`)
    all.push(`\\tfa ${this.smooth(this.style,institute)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(this.style,author)} `);
    all.push(`\\blank[0.2cm]`)
    all.push(`\\tfa ${this.smooth(this.style,date)}`);
    all.push(`\\stopalignment`);
    all.push(`\\page`);
    all.push('');
    return all.join('\n')
  }
  to_choice(style,body,check,usetabulate){
    body = body.filter((s) => s.length)
    var all = [];
    var re_word = /^(\w+)/;
    var v;
    var checks = check?check.split('/'):[];
    if(usetabulate){
      //use starttabulate
      all.push('\\starttabulate[|l|]');
      body.forEach((s) => {
        var start;
        if((v=re_word.exec(s))!==null){
          start = v[1];
        }
        if(this.is_in_list(start,checks)){
          all.push(`\\NC ${this.icon_checkedbox} ${this.uncode(style,s)} \\NC\\NR`)
        }else{
          all.push(`\\NC ${this.icon_hollowbox} ${this.uncode(style,s)} \\NC\\NR`)
        }
      })
      all.push(`\\stoptabulate`)
    }else{
      //use line breaks
      body.forEach((s) => {
        var start;
        if((v=re_word.exec(s))!==null){
          start = v[1];
        }
        if(this.is_in_list(start,checks)){
          all.push(`${this.icon_checkedbox} ${this.uncode(style,s)}\\crlf`)
        }else{
          all.push(`${this.icon_hollowbox} ${this.uncode(style,s)}\\crlf`)
        }
      })
    }
    return all.join('\n')
  }
}
////////////////////////////////////////////////////////////////////////////
// 
////////////////////////////////////////////////////////////////////////////
class NitrilePreviewServer extends NitrilePreviewBase {
  constructor() {
    super();
  }
  async run(){
    const { NitrilePreviewParser } = require('./nitrile-preview-parser');
    const fs = require('fs');
    const path = require('path');
    const process = require('process');
    var fname = process.argv[2];    
    if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      if(parser.tex=='context'){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewCreamer(parser);
        var doc = translator.to_document();
        await this.write_text_file(fs,texfname,doc);
        console.log(`written to ${texfname}`);
      }else if(parser.tex=='pdflatex'||parser.tex=='xelatex'||parser.tex=='lualatex'){
        var texfname = `${fname.slice(0,fname.length-path.extname(fname).length)}.tex`;
        var translator = new NitrilePreviewBeamer(parser);
        var doc = translator.to_document();
        await this.write_text_file(fs,texfname,doc);
        console.log(`written to ${texfname}`);
      }else{
        var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
        var translator = new NitrilePreviewSlide(parser);
        var xhtml = translator.to_xhtml();
        await this.write_text_file(fs,xhtmlfile,xhtml);
        console.log(`written to ${xhtmlfile}`);
      }
    }
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewSlide, NitrilePreviewBeamer, NitrilePreviewCreamer };
if(require.main===module){
  var server = new NitrilePreviewServer();
  server.run()
}
