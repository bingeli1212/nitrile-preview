'use babel';
const { NitrilePreviewHtml } = require('./nitrile-preview-html');
const { NitrilePreviewPresentation } = require('./nitrile-preview-presentation');
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
function img_onload(img){
  var canvasid = img.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  if(canvas){
    var cx = canvas.getContext('2d');
    cx.drawImage(img,0,0,canvas.width,canvas.height);
  }
}
function canvas_onfocusin(canvas){
  var cx = canvas.getContext('2d');
  var imgid = canvas.getAttribute('data-imgid');
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  palette.style.visibility = 'visible';
}
function canvas_onfocusout(canvas){
  var imgid = canvas.getAttribute('data-imgid');
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  //palette.style.visibility = 'hidden';
}
function form_onreset(form){
  var canvasid = form.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var imgid = form.getAttribute('data-imgid');
  var img = document.getElementById(imgid);
  var paletteid = form.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  event.preventDefault();
  if(img){
    var cx = canvas.getContext('2d');
    cx.clearRect(0,0,canvas.width,canvas.height);
    cx.drawImage(img,0,0,canvas.width,canvas.height);
  }
  palette.style.visibility = 'hidden';
}
function form_onsubmit(form){
  var canvasid = form.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var imgsrc = form.getAttribute('data-imgsrc');
  var paletteid = form.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  event.preventDefault();
  if(imgsrc){
    var url = canvas.toDataURL();                
    var png = imgsrc;
    fetch(form.action, { method:'post', body: JSON.stringify({data:"MY DATA",png,url}), headers: { "Content-Type": "application/json" } }).then(r => r.text()).then(text => alert(text));
  }
  palette.style.visibility = 'hidden';
}
function canvas_onmouseenter(canvas){
  canvas.style.cursor = 'crosshair';
  var cx = canvas.getContext('2d');
  if(!cx.cake){
    cx.cake = {};
  }
}
function canvas_onmouseleave(canvas){
  var cx = canvas.getContext("2d");
  canvas.style.cursor = '';
  if(cx.cake && cx.cake.mouseisdown){
    canvas_end(cx,canvas);
    cx.cake.mouseisdown = 0;
  }
}
function canvas_onmousedown(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0 && cx.cake){
    cx.cake.posx0 = Math.round((event.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy0 = Math.round((event.clientY-canvas.getBoundingClientRect().y));
    cx.cake.posx1 = cx.cake.posx0;
    cx.cake.posy1 = cx.cake.posy0;
    cx.cake.posx2 = cx.cake.posx1;
    cx.cake.posy2 = cx.cake.posy1;
    cx.cake.shiftKey = event.shiftKey;
    cx.cake.altKey   = event.altKey;
    cx.cake.mouseisdown = 1;
    cx.cake.mouseisdragged = 0;
    cx.cake.mousedragcount = 0;
    canvas_start(cx,canvas);
  }
}
function canvas_onmousemove(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0 && cx.cake && cx.cake.mouseisdown){
    cx.cake.posx1 = cx.cake.posx2;
    cx.cake.posy1 = cx.cake.posy2;
    cx.cake.posx2 = Math.round((event.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy2 = Math.round((event.clientY-canvas.getBoundingClientRect().y));
    cx.cake.shiftKey = event.shiftKey;
    cx.cake.altKey   = event.altKey;
    cx.cake.mouseisdragged = 1;
    cx.cake.mousedragcount += 1;
    canvas_drag(cx,canvas);
  }
}
function canvas_onmouseup(canvas){
  var cx = canvas.getContext("2d");
  if(event.button==0 && cx.cake && cx.cake.mouseisdown){
    canvas_end(cx,canvas);
    cx.cake.mouseisdown = 0;
    cx.cake.mouseisdragged = 0;
    cx.cake.mousedragcount = 0;
  }
}
function canvas_ontouchstart() {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                             
    var cx = canvas.getContext("2d");
    cx.cake.posx0 = Math.round((touch.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy0 = Math.round((touch.clientY-canvas.getBoundingClientRect().y));
    cx.cake.posx1 = cx.cake.posx0;
    cx.cake.posy1 = cx.cake.posy0;
    cx.cake.posx2 = cx.cake.posx1;
    cx.cake.posy2 = cx.cake.posy1;
    cx.cake.mouseisdown = 1;
    cx.cake.shiftKey = evt.shiftKey;
    cx.cake.altKey   = evt.altKey;
    if(cx.cake.mouseisdown){
      cx.cake.mouseisdragged = 0;
      cx.cake.mousedragcount = 0;
      canvas_start(cx,canvas);
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
    var cx = canvas.getContext("2d");
    cx.cake.posx1 = cx.cake.posx2;
    cx.cake.posy1 = cx.cake.posy2;
    cx.cake.posx2 = Math.round((touch.clientX-canvas.getBoundingClientRect().x));
    cx.cake.posy2 = Math.round((touch.clientY-canvas.getBoundingClientRect().y));
    cx.cake.shiftKey = evt.shiftKey;
    cx.cake.altKey   = evt.altKey;
    if(cx.cake.mouseisdown){
      canvas_drag(cx,canvas);
      cx.cake.mouseisdragged = 1;
      cx.cake.mousedragcount += 1;
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
    var cx = canvas.getContext("2d");
    if(cx.cake.mouseisdown){
      canvas_end(cx,canvas);
      cx.cake.mouseisdragged = 0;
      cx.cake.mousedragcount = 0;
    }
    cx.cake.mouseisdown = 0;
    cx.cake.shiftKey = 0;
    cx.cake.altKey   = 0;
  }
}
function canvas_ontouchcancel(canvas) {
  var evt = event;
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    var canvas = touch.target;                            
    var cx = canvas.getContext("2d");
    if(cx.cake.mouseisdown){
      canvas_end(cx,canvas);
      cx.cake.mouseisdragged = 0;
      cx.cake.mousedragcount = 0;
    }
    cx.cake.mouseisdown = 0;
    cx.cake.shiftKey = 0;
    cx.cake.altKey   = 0;
  }
}
function canvas_start(cx,canvas){
  cx.cake.s = cx.getImageData(0,0, canvas.width,canvas.height);
  cx.cake.hobby_p = [];
  var x = cx.cake.posx0;
  var y = cx.cake.posy0;
  cx.cake.hobby_p.push([x,y]);
}
function canvas_drag(cx,canvas){
  if(canvas_is_visible(cx,canvas)){
    if(cx.cake.shiftKey){ 
      canvas_draw_eraser(cx,canvas);
    }else{
      canvas_draw_pencil(cx,canvas);
    }
  }
}
function canvas_end(cx,canvas){
}
function canvas_is_visible(cx,canvas){
  var paletteid = canvas.getAttribute('data-paletteid');
  var palette = document.getElementById(paletteid);
  return(palette.style.visibility == 'visible');
}
function canvas_draw_eraser(cx,canvas){
  cx.save();
  cx.lineCap = 'round';
  cx.lineWidth = 8;
  cx.globalCompositeOperation = 'destination-out';
  cx.beginPath();
  cx.moveTo(cx.cake.posx1,cx.cake.posy1);
  cx.lineTo(cx.cake.posx2,cx.cake.posy2);
  cx.stroke();
  cx.restore();
} 
function canvas_draw_pencil(cx,canvas){
  var colorinputid = canvas.getAttribute('data-colorinputid');
  var colorinput = document.getElementById(colorinputid);
  cx.lineCap = 'round';
  cx.lineWidth = 1;
  cx.strokeStyle = colorinput.value;  
  // cx.beginPath();
  // cx.moveTo(cx.cake.posx1,cx.cake.posy1);
  // cx.lineTo(cx.cake.posx2,cx.cake.posy2);
  // cx.stroke();
  var x = cx.cake.posx2;
  var y = cx.cake.posy2;
  cx.cake.hobby_p.push([x,y]);
  var tension = 1;
  var knots = makeknots(cx.cake.hobby_p, tension, false);
  mp_make_choices(knots[0]);
  cx.putImageData(cx.cake.s,0,0);
  cx.beginPath();
  cx.moveTo(knots[0].x_pt,knots[0].y_pt);
  for (var i=1; i<knots.length-1; i++) {
    // console.log('bezierCurveTo', knots[i-1].rx_pt.toFixed(2), knots[i-1].ry_pt.toFixed(2) ,   knots[i].lx_pt.toFixed(2), knots[i].ly_pt.toFixed(2),  knots[i].x_pt.toFixed(2),  knots[i].y_pt.toFixed(2));
    cx.bezierCurveTo(
      knots[i-1].rx_pt.toFixed(2), knots[i-1].ry_pt.toFixed(2),
      knots[i].lx_pt.toFixed(2), knots[i].ly_pt.toFixed(2),
      knots[i].x_pt.toFixed(2),  knots[i].y_pt.toFixed(2));
  }
  cx.stroke();
} 
function canvas_oncolorchange(input){
  var canvasid = input.getAttribute('data-canvasid');
  var canvas = document.getElementById(canvasid);
  var cx = canvas.getContext('2d');
  if(cx.cake){
    cx.cake.color = input.value;
  }
}
`;
var stylesheet = `\
:root {
  --titlecolor: #1010B0;
}
.CANVASFORM:hover .CANVASPALETTE{
  visibility: visible;
}
.PARAGRAPH{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.EQUATION{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.FIGURE{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.LISTING{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.LONGTABU{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.COLUMN{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.ALIGNMENT{
  margin-top: 5pt;
  margin-bottom: 5pt;
}
.FIGURE, .COLUMN, .ALIGNMENT, .LISTING, .EQUATION, .LONGTABU {
  margin-left: 0pt;
  margin-right: 0pt;
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
  margin-top: 2.5cm;
  margin-bottom: 0;
  font-size: 1.8em;
  color: var(--titlecolor);
  text-align: center;
  align-self: center;
}
.FRONTMATTERSUBTITLE {
  margin-left: 6.5mm;
  margin-right: 6.5mm;
  margin-top: 0.8cm;
  margin-bottom: 0;
  font-size: 1.1em;
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
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
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
    font-family: Verdana, sans-serif;
    letter-spacing: -0.03em;
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
    this.icon_subpoint = '&#x261E;'//WHITE RIGHT POINTING INDEX
    this.icon_solution = '&#x270D;'//WRITING HAND
    this.icon_folder = '&#x2615;'//HOT BEVERAGE
    this.uchar_checkboxo = '&#x2610;' //BALLOT BOX            
    this.uchar_checkboxc = '&#x2611;' //BALLOT BOX WITH CHECK
    this.uchar_checkboxx = '&#x2612;' //BALLOT BOX WITH X
    this.slide_width = 128;//mm
    this.slide_height = 96;//mm
    this.vw = 482;//px
    this.vh = 362;//px
    this.add_css_map_entry(this.css_map,
      'DD', [
        'margin-left: 0em',
        'padding-left: 3em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'OL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'UL', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SAMP', [
        'padding-left: 2em',
      ]
    );
    this.add_css_map_entry(this.css_map,
      'SAND', [
        'padding-left: 2em',
      ]
    );
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
    var html = this.to_beamer();
    var body = `${title_html}\n${html}`;
    var script = this.to_script();
    var members = this.parser.members;
    return {stylesheet,script,body,members};
  }
  to_beamer() {
    var presentation = new NitrilePreviewPresentation();
    let top = presentation.to_top(this.parser.blocks);
    ///
    ///
    ///
    var d = [];
    var topframes = [];
    top.sections.forEach((sect,i,arr) => {
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
        let out = this.write_frame_folder(`${i+1}`,topframe,subframes);
        d.push(out);
        topframe.subframes.forEach((subframe,j) => {
          let id = `${i+1}.${j+1}`;
          let order = `${i+1}.${j+1}`;
          let out = this.write_one_frame(id,order,subframe,1,topframe);
          d.push(out);
        });
      }else{
        let id = `${i+1}`;
        let order = i+1;
        let out = this.write_one_frame(id,order,topframe,0,topframe);
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
    let boardpng = frame.boardname?`${frame.boardname}.png`:``;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    if(boardpng){
      var imgsrc = boardpng;
      var {imgsrc, imgid} = this.to_request_image(imgsrc);
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' style='position:absolute;left:10mm;top:10mm;' />`)
    }
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
      subframes.forEach((subframe,j,arr) => {
        let icon = this.icon_folder;
        icon = '';
        all.push(`<li style='position:relative;font-decoration:underline;'> <span style='position:absolute;left:-2em' > ${icon} </span> <a style='color:inherit' href='#frame${id}.${j+1}'> ${this.uncode(subframe.style,subframe.title)} </a> </li>`);
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
  write_one_frame(id,order,frame,issub,topframe){
    var css_title = this.css('TITLE');
    var css_subtitle = this.css('TITLE2');
    var css_paragraph = this.css('PARAGRAPH');
    let icon = this.icon_folder;
    let all = [];
    let boardpng = frame.boardname?`${frame.boardname}.png`:``;
    //
    //NOTE: main contents
    //
    all.push(`<article class='SLIDE' id='frame${id}' data-row='${frame.style.row}' style='position:relative;' >`);
    if(boardpng){
      var imgsrc = boardpng;
      var {imgsrc, imgid} = this.to_request_image(imgsrc);
      all.push(`<img src='${imgsrc}' id='${imgid}' alt='' style='position:absolute;left:10mm;top:10mm;' />`)
    }
    if(issub){
      icon = '';
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle};text-decoration:underline' > ${icon} ${this.uncode(frame.style,frame.title)} </h2>`);
    }else{
      all.push(`<h1 class='TITLE'    style='${css_title}' > ${order} ${this.uncode(topframe.style,topframe.title)} </h1>`);
      all.push(`<h2 class='TITLE2' style='${css_subtitle}' > &#160; </h2>`);
    }
    //
    //NOTE: frame contents
    //
    frame.contents.forEach((x,i) => {
      ///'x' is a block
      let html = this.translate_block(x);
      all.push('');
      all.push(html.trim());
    })
    frame.solutions.forEach((o,i,arr) => {
      if(o.choice){
        let text = this.to_choice(o.style,o.body);
        all.push(`<div class='PARAGRAPH' style='${css_paragraph}' > ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> ${text} </div>`);
      }else{
        all.push(`<div class='PARAGRAPH' style='${css_paragraph}' > ${this.icon_solution} <i>${this.uncode(o.style,o.title)}</i> </div>`);
      }
    });
    //
    //NOTE: board name
    //
    all.push('</article>');
    all.push('');
    // 
    //NOTE: individual solution-slides
    //
    frame.solutions.forEach((o,i,arr) => {
      all.push(`<article class='SLIDE' data-row='${o.style.row}'>`);
      all.push(`<h1 class='TITLE' style='${css_title}' > &#160; </h1>`);
      if(o.choice){
        let icon = this.icon_solution;
        let title = this.uncode(o.style,o.title).trim();
        let text = this.to_choice(o.style,o.body,o.choice).trim();
        let row = o.style.row;
        all.push(`<h2 class='TITLE2' style='${css_subtitle}' data-row='${row}' > ${icon} <i> ${title} </i> &#160; ${text} </h2>`)
      }else{
        let icon = this.icon_solution;
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
    var style     = this.parser.style;
    var date      = new Date().toLocaleDateString();
    let data = `<article data-row='0' class='SLIDE'>
    <div class='FRONTMATTERTITLE'     style='${this.css("FRONTMATTERTITLE")}' >${this.smooth(title)}</div>
    <div class='FRONTMATTERSUBTITLE'  style='${this.css("FRONTMATTERSUBTITLE")}' >${this.smooth(subtitle)}</div>
    <div class='FRONTMATTERINSTITUTE' style='${this.css("FRONTMATTERINSTITUTE")}' >${this.smooth(institute)}</div>
    <div class='FRONTMATTERAUTHOR'    style='${this.css("FRONTMATTERAUTHOR")}' >${this.smooth(author)}</div>
    <div class='FRONTMATTERDATE'      style='${this.css("FRONTMATTERDATE")}' >${this.smooth(date)}</div>
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
module.exports = { NitrilePreviewSlide };
////////////////////////////////////////////////////////////////////////////
//
// require.main === module
//
////////////////////////////////////////////////////////////////////////////
const { NitrilePreviewBase } = require('./nitrile-preview-base');
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
    if(!fname){
      throw "File name is empty"
    }else if(path.extname(fname)==='.md'){
      var parser = new NitrilePreviewParser();
      await parser.read_file_async(fname)
      await parser.read_import_async();
      var xhtmlfile = `${fname.slice(0,fname.length-path.extname(fname).length)}.xhtml`;
      var translator = new NitrilePreviewSlide(parser);
      var data = translator.to_data();
      var xhtml = `\
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='default-style' content='text/html' charset='utf-8'/>
<script type="module" src="./mppath.js" ></script>
<script>
//<![CDATA[
${data.script}
//]]>
</script>
<style>
${data.stylesheet}
</style>
</head>
<body>
${data.body}
</body>
</html>
`;
      await this.write_text_file(fs,xhtmlfile,xhtml);
      console.log(`written to ${xhtmlfile}`);
    }else{
      throw "File does not end with .md"
    }
  }
}
if(require.main===module){
  var server = new NitrilePreviewServer();
  server.run()
}
