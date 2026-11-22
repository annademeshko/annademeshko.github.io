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
  if (abs(d) > 46.) { outColor = vec4(0.); return; }
  float angle = atan(p.y - u_origin.y, p.x - u_origin.x);
  float t = u_time;
  float n = noise2(p * .009 + vec2(t * .23, -t * .15));
  float detail = noise2(p * .029 - vec2(t * .18, t * .07));
  vec2 normal = normalize(vec2(signedFront(p+vec2(2.,0.)) - signedFront(p-vec2(2.,0.)),
                              signedFront(p+vec2(0.,2.)) - signedFront(p-vec2(0.,2.))) + vec2(.0001));
  float directional = .5 + .5 * dot(normal, normalize(vec2(-.67, -.74)));
  float band = .5 + .5 * sin(d * .43 + angle * 3.4 + t * 1.1 + 4.3 * n);
  float thinStripe = pow(.5 + .5 * sin(d * .68 - angle * 2.1 + 5.1 * detail - t * 1.5), 7.);
  float specular = pow(max(0., directional), 3.) * .54 + thinStripe * .44;
  float highlight = exp(-pow((d + 1.5 + 1.6 * n) / 3.7, 2.));
  float trough = exp(-pow((d - 8.) / 5.5, 2.));
  float halo = exp(-pow(d / 24., 2.));
  float nearby = exp(-pow(d / 13., 2.));
  float core = exp(-pow(d / 5.0, 2.));
  vec3 silver = mix(vec3(.09, .13, .22), vec3(.81, .86, .96),
                    clamp(.20 + directional*.4 + band*.24 + specular*.45, 0., 1.));
  silver = mix(silver, vec3(.99, .995, 1.), highlight * .64);
  silver = mix(silver, vec3(.018, .032, .085), trough * .32);
  vec3 graphite = mix(vec3(.02, .035, .075), vec3(.72, .76, .86),
                      clamp(.12 + band * .45 + specular*.27, 0., 1.));
  vec3 metal = mix(silver, graphite, u_light);
  float flares = pow(max(0., sin(angle*5.1 - t*.77 + n*3.1)), 13.);
  flares *= .55 + .45 * pow(max(0.,sin(angle*3.4 + t*1.25)), 4.);
  float pRed = exp(-pow((d - 6.) / 4.2, 2.));
  float pGreen = exp(-pow((d - 1.) / 4.1, 2.));
  float pBlue = exp(-pow((d + 4.) / 4.2, 2.));
  vec3 prism = vec3(pRed + .10*pBlue,
                    .42 * pRed + .74*pGreen + .23*pBlue,
                    .14 * pRed + .89*pBlue + .20*pGreen);
  metal = mix(metal, prism, flares * .88);
  float opacity = clamp(.15*halo + .40*nearby + .60*core + .20*highlight, 0., .96);
  opacity *= smoothstep(0.,4.,min(u_time,3.-u_time)) * .91 + .09;
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
