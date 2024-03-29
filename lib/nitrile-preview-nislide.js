'use babel';
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
//const mysvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"> <polyline stroke="#1010B0" stroke-width="3" fill="none" points="7 1 13 7 7 13"/> <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="3" /> </svg>`; 
const mysvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"> <polygon stroke="none" fill="#000000" points="10 6 2 10 2 2"/> </svg>`; 
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
}
function canvas_onmouseleave(canvas){
}
function canvas_onmousedown(canvas){
  var ctx = canvas.getContext("2d");
  if(!ctx.d){
    ctx.d = {};
  }
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
  var imgid = canvas.getAttribute('data-imgid');
  var form = document.getElementById(imgid+"-form");
  form.style.visibility = 'visible';
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
  if(!ctx.d){
    ctx.d = {};
  }
  ctx.d.posx1 = ctx.d.posx2;
  ctx.d.posy1 = ctx.d.posy2;
  ctx.d.posx2 = Math.round((event.clientX-canvas.getBoundingClientRect().x)/canvas.getBoundingClientRect().width*canvas.width);
  ctx.d.posy2 = Math.round((event.clientY-canvas.getBoundingClientRect().y)/canvas.getBoundingClientRect().height*canvas.height);
  ctx.d.shiftKey = event.shiftKey;
  ctx.d.altKey   = event.altKey;
  ctx.d.mouseevent = 'mousemove';
  if(event.button==0 && ctx.d.mouseisdown){
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
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
  if(!ctx.d){
    ctx.d = {};
  }
  if(1){
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
  if(!ctx.d){
    ctx.d = {};
  }
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
function canvas_end(ctx,canvas){
  if(!ctx.d){
    ctx.d = {};
  }
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
function canvas_is_visible(ctx,canvas){
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  return(palette.style.visibility == 'visible');
}
function canvas_draw_drift(ctx,canvas){
  if(0){
    var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
    var dx = ctx.d.posx2-ctx.d.posx1;
    var dy = ctx.d.posy2-ctx.d.posy1;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.putImageData(imgdata,dx,dy);
  }
  ctx.save();
  var dx = ctx.d.posx2-ctx.d.posx1;
  var dy = ctx.d.posy2-ctx.d.posy1;
  ctx.globalCompositeOperation = 'copy';
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(ctx.canvas,dx,dy);
  ctx.restore();
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
  ctx.beginPath();
  ctx.moveTo(ctx.d.posx1,ctx.d.posy1);
  ctx.lineTo(ctx.d.posx2,ctx.d.posy2);
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
}
function canvas_onminus(button){
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
input:not(:checked) ~ span.hrule{
  text-indent:-999px;   
}
figure{
  width:100%;
}
:root {
  --titlecolor: rgb(20%,20%,70%);
  --myimg: url("${myimg}");
}
table.TAB th{ 
  padding: 0.215em 3pt;
}
table.TAB td{ 
  padding: 0.215em 3pt;
}
ul.DETAILS > li{
  list-style-image: var(--myimg);
}
ul.DETAILS{
  margin: 7pt 0pt;
  padding-left: 20pt;
}
ol.DETAILS{
  margin: 7pt 0pt;
  padding-left: 20pt;
}
dl.DETAILS > dd{
  padding-left: 20pt;
}
ul.ITEMIZE{
  margin: 7pt 0pt;
  padding-left: 20pt;
}
ol.ITEMIZE{
  margin: 7pt 0pt;
  padding-left: 20pt;
}
.MULTICOL{
  margin: 7pt 0pt;
}
.EXAMPLE{
  margin: 7pt 0pt;
}
.DESCRIPTION{
  margin: 7pt 0pt;
}
.DESCRIPTION dd{
  padding-left: 20pt;
}
.BODY{
  margin: 7pt 0pt;
}
.PREFORMATTED{
  margin: 7pt 0pt;
}
.DETAILS{
  margin: 7pt 0pt;
}
.DETAILSROW{
  margin: 7pt 0pt;
}
.DETAILSBODY{
  margin: 7pt 0pt;
}
.ALIGNMENT{
  margin: 7pt 0pt;
}
.PRIMARY{
  margin: 7pt 0pt;
}
.SECONDARY{
  margin: 7pt 0pt;
}
.EQUATION{
  margin: 7pt 0pt;
}
.FIGURE{
  margin: 7pt 0pt;
}
.LISTING{
  margin: 7pt 0pt;
}
.TABLE{
  margin: 7pt 0pt;
}
.LINES{
  margin: 7pt 0pt;
}
.STAMP{
  margin: 7pt 0pt;
}
.CAPTION{
  font-size: smaller;
}
.SUBCAPTION{
  text-align: center;
  margin: 0;
  padding: 0;
  font-size: smaller;
}
.TITLE {
  margin-left:  -12pt;
  margin-right: -12pt;
  margin-top: 5pt;
  margin-bottom: 0;
  font-size:1.30em;
  font-weight: 500;
  color: var(--titlecolor);
  position: relative;
  top: 0pt;
}
.TITLE2 {
  margin-left:  -12pt;
  margin-right: -12pt;
  margin-top: 0;
  margin-bottom: 0;
  font-size:0.8em;
  font-weight: 500;
  color: var(--titlecolor);
  position: relative;
  top: 0pt;
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
    padding:1px 8mm;
  }
  body {
    margin:0;
    padding:0;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.15;
  }
}
@media screen {
  .SLIDE {
    color: black;
    position: relative;
    background-color: white;
    margin: 7pt auto;
    min-width:128mm;
    max-width:128mm;
    min-height:96mm;
    max-height:96mm;
    box-sizing:border-box;
    overflow: hidden;
    padding:1px 8mm;
  }
  body {
    background-color: gray;
    box-sizing:border-box;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10pt;
    line-height: 1.15;
    margin:0;
    padding:1px 0;
  }
}
`;

class NitrilePreviewSlide extends NitrilePreviewHtml {
  constructor(parser) {
    super(parser);
    this.name = 'slide';
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.vw = 482;//px
    this.vh = 362;//px
    this.canvasimgid = 0;
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0pt',
        'margin-bottom: 0pt',
        'font-size: 1.4em',
        'color: var(--titlecolor)',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERSUBTITLE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0pt',
        'margin-bottom: 0pt',
        'font-size: 1.0em',
        'color: var(--titlecolor)',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERINSTITUTE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0pt',
        'margin-bottom: 0pt',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERAUTHOR', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0pt',
        'margin-bottom: 0pt',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'FRONTMATTERDATE', [
        'margin-left: 6.5mm',
        'margin-right: 6.5mm',
        'margin-top: 0pt',
        'margin-bottom: 0pt',
        'font-size: 1.1em',
        'text-align: center',
        'align-self: center',
      ]
    );
  }
  to_peek_document() {
    var title_html = this.to_titlepagelines().join('\n')
    var html = this.to_slide().join('\n');
    return `${title_html}\n${html}`;
  }
  to_script(){
    return script;///global variable
  }
  to_data() {
    var title_html = this.to_titlepagelines().join('\n')
    var title = this.uncode(this.parser.style,this.parser.title);
    var html = this.to_slide().join('\n');
    var body = `${title_html}\n${html}`;
    var script = this.to_script();
    var members = this.parser.members;
    return {stylesheet,script,body,members,title};
  }
  to_document() {
    var data = this.to_data();
    var all = [];
    all.push(`<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">`);
    all.push(`<html xmlns='http://www.w3.org/1999/xhtml'>`);
    all.push(`<head>`);
    all.push(`<meta http-equiv='default-style' content='text/html' charset='utf-8'/>`);
    all.push(`<title> ${data.title} </title>`);
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
  to_slide() {
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
        let subid = '';
        let out = this.write_one_frame(id,subid,topframe,0,topframe);
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
    var toc = this.write_frame_toc(topframes);
    //
    // put together
    //
    var d = [];
    d.push(toc);
    d.push(main);
    return d;
  }
  write_frame_toc(topframes){
    /// decide if we need to change fonts
    var all = [];
    var n = 0;
    var max_n = 16;
    var css_title = this.css('TITLE');
    var css_title2 = this.css('TITLE2');
    var css_ol = this.css('OL');
    topframes.forEach((x,j,arr) => {
      if(n==max_n){
        all.push(`</ol>`);
        all.push('</article>');
        all.push(''); 
        n=0;
      }
      if(n==0){
        all.push(`<article data-row='0' class='SLIDE' id='toc' >`);
        all.push(`<h1 class='TITLE'  style='${css_title}' > Table Of Contents </h1>`);
        all.push(`<h2 class='TITLE2' style='${css_title2}' > &#160; </h2>`);
        all.push(`<ol style='' >`);
      }
      //let icon = `<span style='position:absolute;right:100%;top:50%;transform:translate(-1.12ex,-50%);'>${j+1}</span>`;
      let order = j+1;
      all.push(`<li value='${order}'> <a style='color:inherit' href='#frame${j+1}.'> ${this.polish(x.style,x.title)} </a> </li>`);
      n++;
    });
    all.push(`</ol>`);
    all.push('</article>');
    all.push(''); 
    return all.join('\n')
  }
  write_one_frame(id,subid,frame,issub,topframe){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    let all = [];
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}.${subid}' data-row='${frame.style.row}' style='position:relative;'>`);
    if(subid){
      all.push(`<h1 class='TITLE'    style='${css_title}' > <a style='text-decoration:none;color:inherit;' href='#toc'> ${id}. ${this.polish(topframe.style,topframe.title)} </a> </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle};text-decoration:underline' > <a style='text-decorationb:none;color:inherit;' href='#frame${id}.'> ${id}.${subid} ${this.polish(frame.style,frame.title)} </a> </h2>`);
    }else{
      all.push(`<h1 class='TITLE'    style='${css_title}' > <a style='text-decoration:none;color:inherit;' href='#toc'> ${id}. ${this.polish(topframe.style,topframe.title)} </a> </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
    }
    //
    //NOTE: sort into two different bins
    //
    var wrap_contents = [];
    var norm_contents = [];
    frame.contents.forEach(x => {
      if(x.id=='column'){
        wrap_contents.push(x);
      }else{
        norm_contents.push(x);
      }
    });
    //
    //NOTE: check double-column-layout
    //
    if(wrap_contents.length){
      all.push(`<div style='column-count:2'>`);
      norm_contents.forEach((x,i) => {
        ///'x' is a block
        let html = this.translate_block(x);
        all.push(html.trim());
      })       
      frame.solutions.forEach((o,i,arr) => {
        if(i>0){
          all.push('<br/>')
        }
        all.push(`<u>${this.uncode(o.style,o.title)}</u>`);
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(text);
        }
      });
      all.push(`<div style='break-after:column'></div>`);
      wrap_contents.forEach((x,i) => {
        all.push(`<table class='BODY' style='${this.css("BODY")};width:100%'>`)
        all.push(`<tr>`);
        all.push(`<td style='text-align:center'>`);
        let bundles = this.body_to_all_bundles(x.style,x.body);
        bundles.forEach((bundle) => {
          let p = this.do_bundle(bundle);
          if(p.img){
            all.push(p.img);
          }else if(p.tab){
            all.push(p.tab);
          }
        });
        all.push(`</td>`);
        all.push(`</tr>`);
        if(x.title){
          all.push(`<caption style='text-align:center;caption-side:bottom'>${this.uncode(x.style,x.title)}</caption>`)
        }
        all.push(`</table>`)
      })           
      all.push(`</div>`)
    }else{
      norm_contents.forEach((x,i) => {
        ///'x' is a block
        let html = this.translate_block(x);
        all.push('');
        all.push(html.trim());
      })
      all.push(`<div class='BODY' style='${this.css("BODY")}'>`);
      frame.solutions.forEach((o,i,arr) => {
        if(i>0){
          all.push('<br/>')
        }
        all.push(`<u>${this.uncode(o.style,o.title)}</u>`);
        if(o.choice){
          let text = this.to_choice(o.style,o.body);
          all.push(text);
        }
      });
      all.push(`</div>`);
    }
    //
    //NOTE: subframes
    //
    if(frame.subframes && Array.isArray(frame.subframes)){
      // subframes
      all.push(`<ol style=''>`);
      frame.subframes.forEach((x,i,arr) => {
        all.push(`<li value='${i+1}' style='text-decoration:underline;'> <a style='color:inherit' href='#frame${id}.${i+1}'> ${this.polish(x.style,x.title)} </a> </li>`);
      });
      all.push(`</ol>`);
      all.push('');
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
      all.push(`<article class='SLIDE' style='position:relative;' data-row='${o.style.row}'>`);
      all.push(`<h1 class='TITLE' style='${css_title}' > &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_dag;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > <u> ${title} </u> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_dag;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.uncode(o.style,this.join_para(o.body)).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > <u> ${title} </u> &#160; ${text} </h2>`)
      }
      let wraps = [];
      let norms = [];
      o.contents.forEach(x => {
        if(x.id=='column'){
          wraps.push(x);
        }else{
          norms.push(x);
        }
      });
      if(wraps.length){
        all.push(`<div style='column-count:2'>`)
        norms.forEach((x) => {
          //'x' is a block
          let html = this.translate_block(x);
          all.push('');
          all.push(html.trim());
        });
        all.push(`<div style='break-after:column'></div>`)
        wraps.forEach((x) => {
          all.push(`<table class='BODY' style='${this.css("BODY")};width:100%'>`)
          all.push(`<tr>`);
          all.push(`<td style='text-align:center'>`);
          let bundles = this.body_to_all_bundles(x.style,x.body);
          bundles.forEach((bundle) => {
            let p = this.do_bundle(bundle);
            if(p.img){
              all.push(p.img);       
            }else if(p.tab){
              all.push(p.tab);       
            }
          })
          all.push(`</td>`);
          all.push(`</tr>`);
          if(x.title){
            all.push(`<caption style='text-align:center;caption-side:bottom'>${this.uncode(x.style,x.title)}</caption>`)
          }
          all.push(`</table>`);
        });
        all.push(`</div>`)
      }else{
        norms.forEach((x) => {
          //'x' is a block
          let html = this.translate_block(x);
          all.push('');
          all.push(html.trim());
        });
      }
      all.push('</article>');
      all.push('');
    })
    //
    //NOTE: end
    //
    return all.join('\n');
  }
  to_titlepagelines(){
    let title     = this.parser.conf_to_string('title','&nbsp;');
    let subtitle  = this.parser.conf_to_string('subtitle','&nbsp;')
    let institute = this.parser.conf_to_string('institute','&nbsp;');
    let author    = this.parser.conf_to_string('author','&nbsp;');
    var date      = new Date().toLocaleDateString();
    var lines = [];
    lines.push(`<article data-row='0' class='SLIDE' style='display:flex;flex-direction:column;justify-content:center;'>`);
    lines.push(`<div style='${this.css("FRONTMATTERTITLE")}' >${this.smooth(this.parser.style,title)}</div>`);
    lines.push(`<div style='${this.css("FRONTMATTERSUBTITLE")}' >${this.smooth(this.parser.style,subtitle)}</div>`);
    lines.push(`<div style='${this.css("FRONTMATTERINSTITUTE")}' >${this.smooth(this.parser.style,institute)}</div>`);
    lines.push(`<div style='${this.css("FRONTMATTERAUTHOR")}' >${this.smooth(this.parser.style,author)}</div>`);
    lines.push(`<div style='${this.css("FRONTMATTERDATE")}' >${this.smooth(this.parser.style,date)}</div>`);
    lines.push(`</article>`);
    return lines;
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
        all.push(`<li> ${this.icon_checkedbox} ${this.uncode(style,s)} </li>`)
      }else{
        all.push(`<li> ${this.icon_hollowbox} ${this.uncode(style,s)} </li>`)
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
  fence_to_img(g,ss){
    if(g.type=='canvas'){
      var colors = [];
      var imgsrc = [];
      const re_image = /^\\image\s+"(.*)"$/;
      const re_color = /^\\color\s+"(.*)"$/;
      var v;
      ss.forEach((s)=>{
        if((v=re_image.exec(s))!==null){
          imgsrc=(v[1]);
        }
        else if((v=re_color.exec(s))!==null){
          colors.push(v[1]);
        }
      });
      var [viewport_width,viewport_height,viewport_unit] = this.g_to_viewport_array(g);
      var unit = viewport_unit;
      var inkwidth = viewport_width*viewport_unit;
      var inkheight = viewport_height*viewport_unit;
      var vw = inkwidth*this.MM_TO_PX;
      var vh = inkheight*this.MM_TO_PX;
      var width = this.g_to_width_float(g);
      var height = this.g_to_height_float(g);
      var stretch = this.assert_float(g.stretch,0,0,1);
      if(width && height){
      }else if(width){
        height = viewport_height/viewport_width*width;
      }else if(height){
        width = viewport_width/viewport_height*height;
      }else{
        width = inkwidth;//mm
        height = inkheight;//mm
      }
      var imgid = ++this.canvasimgid;
      var border = g.frame?'thin solid currentColor':'';
      if(stretch){
        var img = `<img style="border:${border};width:${stretch*100}%;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
      }else{
        var img = `<img style="border:${border};width:${width}mm;aspect-ratio:${width}/${height};" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
      }
      var datalist = `<datalist id='${imgid}-datalist'> ${colors.map(s=>"<option>"+s+"</option>").join("")} </datalist>`;
      var canvaswidget = `<canvas style='border:${border};z-index:1;width:${width}mm;height:${height}mm;left:0;right:0;top:0;bottom:0;' width='${vw}' height='${vh}' onmouseenter="canvas_onmouseenter(this)" onmouseleave="canvas_onmouseleave(this)" onmousedown="canvas_onmousedown(this)" onmousemove="canvas_onmousemove(this)" onmouseup="canvas_onmouseup(this)" ontouchstart="canvas_ontouchstart(this)" ontouchmove="canvas_ontouchmove(this)" ontouchend="canvas_ontouchend(this)" ontouchcancel="canvas_ontouchcancel(this)" onfocusin="canvas_onfocusin(this)" onfocusout="canvas_onfocusout(this)" onkeydown="canvas_onkeydown(this)" data-imgid='${imgid}' data-paletteid='${imgid}-palette' data-colorinputid='${imgid}-colorinput' id='${imgid}-canvas' data-unit='${unit}' tabIndex='1' > </canvas>`;
      var formwidget = `<form action='/action.php' method='post' class='CANVASPALETTE' style='z-index:2;position:absolute;top:100%;left:0;visibility:hidden;' data-imgid='${imgid}' id='${imgid}-form' onreset='form_onreset(this)' onsubmit='form_onsubmit(this)' ><input class='CANVASSUBMIT' type='submit'/><input class='CANVASRESET' type='reset'/><input class='CANVASCOLOR' type='color' value='#476fc7' onchange='canvas_oncolorchange(this)' data-imgid='${imgid}' id='${imgid}-colorinput' list='${imgid}-datalist' /> ${datalist} </form>`;
      var imgwidget = `<img style="aspect-ratio:${width}/${height};position:absolute;visibility:none;" src="${imgsrc}" id="${imgid}" onload="img_onload(this)"> </img>`;
      var spanwidget = `<span style='position:relative;' data-imgsrc='' data-imgid='${imgid}' data-paletteid='${imgid}-palette' > ${canvaswidget} ${formwidget} ${imgwidget} </span>`
      var itm = {};
      itm.img = spanwidget;
      itm.width = width;
      itm.height = height;
      itm.subtitle = '';
      itm.stretch = stretch;
      return itm;
    }
    if(g.type=='ball'){
      var itm = this.diagram.to_diagram(g,ss);
      var ballscript = itm.ballscript;
      var svgtext = itm.svgtext;
      var svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" stroke="currentColor" viewBox="0 0 ${this.fix(vw)} ${this.fix(vh)}" onmouseup="mouseup(this)" onmousemove="mousemove(this)" preserveAspectRatio="none">${ballscript}${svgtext}</svg>`;
      var { imgsrc, imgid } = this.to_request_svgid(svg);
      var border = g.frame?'thin solid currentColor':'';
      if(stretch){
        var objectwidget = `<object style="border:${border};width:${stretch*100}%;height:auto;" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}"></object>`;
      }else{
        var objectwidget = `<object style="border:${border};width:${width}mm;height:${height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}"></object>`;
      }
      itm.img = objectwidget;
      itm.width = width;
      itm.height = height;
      itm.subtitle = '';
      itm.stretch = stretch;
      return itm;
    }
    if(g.type=='demo'){
      var itm = this.diagram.to_diagram(g,ss);
      var demo_svg = demo_svg1;
      var border = g.frame?'thin solid currentColor':'';
      if(stretch){
        var objectwidget = `<object style="border:${border};width:${stretch*100}%;height:auto;" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(demo_svg)}"></object>`;
      }else{
        var objectwidget = `<object style="border:${border};width:${itm.width}mm;height:${itm.height}mm" type="image/svg+xml" data="data:image/svg+xml;charset=UTF-8,${encodeURIComponent(demo_svg)}"></object>`;
      }
      itm.img  = objectwidget;
      itm.width = width;
      itm.height = height;
      itm.subtitle = '';
      itm.stretch = stretch;
      return itm;
    }
    return super.fence_to_img(g,ss);
  }
}
////////////////////////////////////////////////////////////////////////////
// require.main === module
////////////////////////////////////////////////////////////////////////////
module.exports = { NitrilePreviewSlide };
async function run(){
  const fs = require('fs');
  const path = require('path');
  const process = require('process');
  const { NitrilePreviewParser } = require('./nitrile-preview-parser');
  for(var i=2; i < process.argv.length; ++i){
    var file = process.argv[i];
    var mdfname = `${file.slice(0,file.length-path.extname(file).length)}.md`;
    var xhtmlfname = `${file.slice(0,file.length-path.extname(file).length)}.xhtml`;
    var parser = new NitrilePreviewParser();
    var translator = new NitrilePreviewSlide(parser);
    await parser.read_file_async(mdfname)
    await parser.read_import_async();
    var document = translator.to_document();
    await translator.write_text_file(fs,xhtmlfname,document);
    console.log(`written to ${xhtmlfname}`);
  }
}
if(require.main===module){
  run();
}
