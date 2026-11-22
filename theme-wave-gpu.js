/* GPU Liquid Metal rim, inspired by Paper Shaders liquid-metal.ts material model.
 * Standalone WebGL2: noise-warped reflection bands and spectral dispersion.
 * https://github.com/paper-design/shaders
 * The reveal shape stays one contiguous SVG/CSS curve. */
(function () {
'use strict';
function createLiquidMetalRenderer(canvas, width, height, direction) {
  let gl;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: true,
      powerPreference: 'low-power'
    });
  } catch (_error) { return null; }
  if (!gl) return null;
  const vertex = `#version 300 es
precision highp float;
void main() {
  vec2 position = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}`;
  const fragment = `#version 300 es
precision highp float;
uniform vec2 u_view;
uniform vec2 u_buffer;
uniform vec2 u_origin;
uniform float u_radius;
uniform float u_progress;
uniform float u_time;
uniform float u_light;
out vec4 outColor;

float wrapAngle(float a, float b) { return atan(sin(a-b), cos(a-b)); }
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0-2.0*f);
  return mix(mix(hash12(i),hash12(i+vec2(1.,0.)),f.x),
             mix(hash12(i+vec2(0.,1.)),hash12(i+vec2(1.,1.)),f.x),f.y);
}
float signedFront(vec2 point) {
  vec2 v = point - u_origin;
  float a = atan(v.y, v.x);
  float t = u_progress;
  float slow = .098 * sin(2. * a - t * 2.3 + .35);
  float fold = .072 * sin(3. * a + t * 1.75 - .95);
  float rip = .032 * sin(6. * a - t * 3.3 + .68);
  float angle = -.8 + .26 * sin(t * 2.15);
  float tongue = .265 * exp(-pow(wrapAngle(a,angle)/.18, 2.));
  float pocket = -.138 * exp(-pow(wrapAngle(a,angle+.38)/.25, 2.));
  float resistance = -.115 * exp(-pow(wrapAngle(a,2.25-t*.4)/.33, 2.));
  float r = u_radius * max(.7, 1. + slow + fold + rip + tongue + pocket + resistance);
  return length(v) - r;
}
void main() {
  vec2 p = vec2(gl_FragCoord.x / u_buffer.x * u_view.x,
                (1. - gl_FragCoord.y / u_buffer.y) * u_view.y);
  float d = signedFront(p);
  if (abs(d) > 60.) { outColor = vec4(0.); return; }
  float angle = atan(p.y - u_origin.y, p.x - u_origin.x);
  float t = u_time;
  float n = noise2(p * .009 + vec2(t * .23, -t * .15));
  float detail = noise2(p * .029 - vec2(t * .18, t * .07));
  vec2 normal = normalize(vec2(signedFront(p+vec2(2.,0.)) - signedFront(p-vec2(2.,0.)),
                              signedFront(p+vec2(0.,2.)) - signedFront(p-vec2(0.,2.))) + vec2(.0001));
  float directional = .5 + .5 * dot(normal, normalize(vec2(-.67, -.74)));
  // Chrome bands respond to the deformed front normal. Widen the
  // near-black valley and the white specular ridge so both show clearly
  // against either a light or dark page.
  float flow = .5 + .5 * sin(d * .34 + angle * 4.25 + t * .94 + 4.2 * n);
  float striation = .5 + .5 * sin(d * .64 - angle * 2.9 + 5.1 * detail - t * 1.17);
  float microGlint = pow(striation, 5.);
  float whiteRidge = exp(-pow((d + 1.0 + 2.2 * n) / 3.1, 2.));
  float blackValley = exp(-pow((d - 10.0 - 2.0 * detail) / 6.4, 2.));
  float coldShoulder = exp(-pow((d + 14.) / 10., 2.));
  float broadGlow = exp(-pow(d / 31., 2.));
  float nearby = exp(-pow(d / 13., 2.));
  float sharp = exp(-pow(d / 4.3, 2.));
  float reflection = clamp(.16 + .62 * flow + .16 * directional +
    .34 * microGlint, 0., 1.);
  vec3 silver = mix(vec3(.014,.021,.043), vec3(.985,.990,1.),
                    reflection);
  silver = mix(silver, vec3(.007,.013,.034), blackValley * .78);
  silver = mix(silver, vec3(.995,.998,1.), whiteRidge * .89);
  silver = mix(silver, vec3(.72,.73,.76), coldShoulder * .18);
  // On the light and pink themes, the dark graphite valley makes the
  // chrome readable instead of dissolving into the white background.
  vec3 graphite = mix(vec3(.008,.012,.030), vec3(.985,.986,1.),
                      clamp(.10 + flow * .70 + microGlint * .22, 0., 1.));
  graphite = mix(graphite, vec3(.009,.014,.025), blackValley * .90);
  graphite = mix(graphite, vec3(1.), whiteRidge * .88);
  vec3 metal = mix(silver, graphite, u_light);

  // Prismatic highlights run along TWO moving stretches of the SAME wave.
  // Broad angular envelopes replace the previous almost invisible
  // high-power sine product; there are no separate blobs or lens loops.
  // Warm optical dispersion: crimson -> vermilion -> amber -> gold.
  // The spectral colors stay on two stretches of the SAME moving wave;
  // remove blue/teal channels that previously merged into murky cyan.
  float ribbonA = exp(-pow(wrapAngle(angle, -.96 + .20*sin(t*.60)) / .53, 2.));
  float ribbonB = exp(-pow(wrapAngle(angle, 2.32 - .24*cos(t*.47)) / .65, 2.));
  float ribbonGate = clamp(max(ribbonA, ribbonB) * (.84 + .16*detail), 0., 1.);
  float warmWidth = exp(-pow((d - 0.5) / 13.4, 2.));
  float crimson = exp(-pow((d - 5.5) / 3.8, 2.));
  float orange = exp(-pow((d - 0.3) / 4.1, 2.));
  float gold = exp(-pow((d + 5.2) / 4.0, 2.));
  vec3 warmSpectrum = clamp(vec3(
      1.04*crimson + 1.01*orange + .98*gold,
      .12*crimson + .41*orange + .72*gold,
      .075*crimson + .095*orange + .19*gold
    ), 0., 1.);
  float prismStrength = clamp((.045 + .955*ribbonGate) * warmWidth, 0., 1.);
  metal = mix(metal, warmSpectrum, prismStrength * .97);
  // A small warm reflection follows the crisp silver crest.
  metal += vec3(.092,.043,.018) * whiteRidge * ribbonGate;

  // More opaque, deeper relief: graphite shadow + bright chrome line
  // plus a subtle 30px halo. Transparent away from the single wave.
  float opacity = clamp(.24*broadGlow + .70*nearby +
                        .44*sharp + .15*whiteRidge, 0., .98);
  // Remain visible throughout the middle of the three-second switch,
  // with only short fade-ins/outs at the very beginning and end.
  opacity *= smoothstep(0., .18, u_time) *
             smoothstep(0., .18, 3. - u_time);
  outColor = vec4(metal, opacity);
}`;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Liquid Metal shader compilation:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vert = compile(gl.VERTEX_SHADER, vertex);
  const frag = compile(gl.FRAGMENT_SHADER, fragment);
  if (!vert || !frag) {
    if (vert) gl.deleteShader(vert);
    if (frag) gl.deleteShader(frag);
    return null;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Liquid Metal shader linking:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  const ratio = Math.min(window.devicePixelRatio || 1, 1.35,
    Math.sqrt(1800000 / Math.max(1, width * height)));
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  const uniforms = Object.fromEntries(['u_view','u_buffer','u_origin','u_radius','u_progress','u_time','u_light']
    .map(key => [key,gl.getUniformLocation(program,key)]));
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.viewport(0,0,canvas.width,canvas.height);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.BLEND);
  gl.useProgram(program);
  gl.uniform2f(uniforms.u_view,width,height);
  gl.uniform2f(uniforms.u_buffer,canvas.width,canvas.height);
  gl.uniform1f(uniforms.u_light, direction==='light'||direction==='pink' ? 1 : 0);
  let lost = false;
  canvas.addEventListener('webglcontextlost', e => {e.preventDefault(); lost = true;}, {once:true});
  return {
    draw(x,y,radius,progress) {
      if (lost) return;
      gl.useProgram(program);
      gl.uniform2f(uniforms.u_origin,x,y);
      gl.uniform1f(uniforms.u_radius,radius);
      gl.uniform1f(uniforms.u_progress,progress);
      gl.uniform1f(uniforms.u_time,3*progress);
      gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES,0,3);
    },
    destroy() {
      if (lost) return;
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      lost=true;
    }
  };
}
window.ThemeWaveGPU = { create: createLiquidMetalRenderer };
})();
