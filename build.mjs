// Builds public/ from the page definitions below. Run `node build.mjs` and commit public/.
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ORIGIN = 'https://managedcreative.uk';
const EMAIL = 'hello@managedcreative.uk';
const PHONE = '01204 954050';
const TEL = 'tel:+441204954050';
const WHATSAPP = '07396 037987';
const WA = 'https://wa.me/447396037987?text=Hi%20Managed%20Creative%2C%20I%20have%20an%20enquiry.';
const mail = (s) => `mailto:${EMAIL}?subject=${encodeURIComponent(s)}`;
const star = '<svg aria-hidden="true"><use href="#star"/></svg>';
const ticks = (items) => `<ul class="ticks">${items.map((i) => `<li>${star}<span>${i}</span></li>`).join('')}</ul>`;
const faq = (q, a) => `<details><summary>${q}</summary><p>${a}</p></details>`;

const SERVICES = [
  { slug: 'wordpress-websites', name: 'WordPress websites', tag: 'Flexible and familiar', c: 'var(--amber)',
    a: 'A versatile, content-managed website that can grow with your business. Ideal when you need flexibility, regular updates or room for additional features.',
    b: 'From a new business website to a considered redesign, we’ll focus on making your content clear, your brand consistent and your next steps easy to find.',
    link: 'Talk to us about WordPress', subject: 'WordPress website enquiry',
    title: 'WordPress Website Design in Bolton', desc: 'WordPress websites for businesses in Bolton and across the North West: flexible, content-managed sites designed around your goals.',
    fit: ['You publish news, guides or other content regularly', 'You expect to add features as the business grows', 'You want a platform many people already know how to use', 'You’re redesigning an existing WordPress site'],
    inc: ['Planning your pages, content and calls to action', 'Design that reflects your brand', 'A responsive build for phones, tablets and desktops', 'Setting up the content you’ll edit yourself', 'Checks before launch, and an agreed plan for what happens next'],
    note: 'Hosting and ongoing care are scoped separately from the build. Where appropriate, we can discuss web hosting through <a href="https://managedweb.uk/">Managed Web</a>, part of the wider Managed Technology Group.' },
  { slug: 'webflow-websites', name: 'Webflow websites', tag: 'Design-led and editable', c: 'var(--coral)',
    a: 'A polished, visually distinctive website with a content management system for the pages and stories you need to keep fresh.',
    b: 'Webflow can be a good fit when you want a design-led online presence with a straightforward way to manage your content. We’ll help you decide whether it suits your project.',
    link: 'Talk to us about Webflow', subject: 'Webflow website enquiry',
    title: 'Webflow Website Design in Bolton', desc: 'Design-led Webflow websites for businesses in Bolton and across the North West, with a straightforward way to manage your content.',
    fit: ['How your website looks and feels is central to your brand', 'You want to update pages and stories without touching code', 'You don’t need a large range of plugins or add-ons', 'You’re comfortable with a platform subscription'],
    inc: ['Planning your pages, content and calls to action', 'A distinctive design built around your brand', 'A responsive build for phones, tablets and desktops', 'A content management setup for what you’ll keep fresh', 'Checks before launch, and an agreed plan for what happens next'],
    note: 'Webflow subscriptions and ongoing care are scoped separately from the build, so you can see what each part covers.' },
  { slug: 'custom-applications', name: 'Custom applications', tag: 'Built on Cloudflare Workers', c: 'var(--violet)',
    a: 'Some ideas need more than a conventional website. We create purpose-built applications for tasks, workflows and services, designed around the people who will use them.',
    b: 'Whether you have an internal process to simplify or an idea for a customer-facing service, we’ll start with what the application needs to do and define the right functionality for the project.',
    link: 'Discuss your application', subject: 'Custom application enquiry',
    title: 'Custom Web Applications in Bolton', desc: 'Purpose-built applications on Cloudflare Workers for tasks, workflows and services, designed around the people who will use them.',
    fit: ['A process relies on spreadsheets, re-keying or repeated emails', 'Customers need to complete a task or use a service online', 'Off-the-shelf software doesn’t fit how you work', 'You have an idea and want to define what it should do first'],
    inc: ['Working out what the application needs to do, and for whom', 'Agreeing functionality, integrations and security', 'Designing the screens and journeys people will use', 'Building on Cloudflare Workers', 'Agreeing ongoing costs and support for each project'],
    note: 'A custom application is separate from a website project. It’s software that helps people perform tasks or use a service, not a website converted into an app.' },
  { slug: 'branding-design', name: 'Branding and design', tag: 'A consistent look and voice', c: '#D4478F', 
    a: 'A clear identity helps people recognise you and remember what you stand for. We create logos, visual identities and design work that feel like your business wherever they appear.',
    b: 'Whether you’re starting out or your current look no longer fits, we’ll start with what you need the brand to do, then build the pieces you’ll use day to day.',
    link: 'Talk to us about branding', subject: 'Branding and design enquiry',
    title: 'Branding & Graphic Design in Bolton', desc: 'Logos, visual identities and design work for businesses in Bolton and across the North West, consistent wherever your brand appears.',
    fit: ['You’re launching a new business, brand or service', 'Your look has become inconsistent across different places', 'Your brand no longer reflects what you do', 'You need materials your team can use and reuse'],
    inc: ['Logo design and logo files for different uses', 'Colours, typography and a simple set of brand guidelines', 'Print and digital design, such as brochures and flyers', 'Social media graphics and reusable templates'],
    note: 'We’ll agree exactly what you need as part of a tailored proposal, so you only commission what’s useful.' },
  { slug: 'marketing', name: 'Marketing', tag: 'Connected to your goals', c: '#A24BD6',
    a: 'Good marketing starts with knowing who you want to reach and what you want them to do. We help you plan and create marketing that’s clear, consistent and connected to your website.',
    b: 'Whether you need a straightforward plan or help producing the content, we’ll focus on the activity that suits your business and the people you serve.',
    link: 'Talk to us about marketing', subject: 'Marketing enquiry',
    title: 'Marketing Support in Bolton', desc: 'Marketing planning, content and campaigns for businesses in Bolton and across the North West, connected to your brand and website.',
    fit: ['You’re not sure which marketing activity to prioritise', 'You know what to say but don’t have time to produce it', 'Your marketing and website tell different stories', 'You’re launching something and need to get the word out'],
    inc: ['Marketing planning and priorities', 'Website and campaign copywriting', 'Social media content and scheduling', 'Email campaigns', 'Search-friendly content and local visibility basics'],
    note: 'Advertising spend and third-party subscriptions are scoped separately. We’ll be open about what each part covers and what we’d need from you.' },
];

const FAQS = [
  ['Which platform is right for me?', 'It depends on your content, functionality, budget and how you want to manage the finished project. We’ll discuss the options and recommend an approach based on what you need.'],
  ['How is a custom application different from a website?', 'A website primarily presents information; a custom application is designed to help people complete tasks or use a service. We build applications on Cloudflare Workers, with the functionality, integrations and ongoing costs agreed for each project.'],
  ['Can I update my website myself?', 'WordPress and Webflow both offer ways to manage website content. We’ll discuss which parts you need to update and how you’ll use them as part of your project.'],
  ['Can you help with hosting and ongoing care?', 'Yes. We can discuss hosting through Managed Web and agree the right level of ongoing care. Hosting, platform subscriptions and maintenance are scoped separately from the build.'],
  ['Can you help with branding and marketing as well as websites?', 'Yes. We can work on your brand, your website and your marketing together, or on one part at a time. We’ll agree what’s useful as part of your proposal.'],
  ['How much will my project cost?', 'Every project is different. We’ll understand what you need first, then provide a tailored proposal covering the scope, costs and any ongoing fees.'],
  ['Do you work with businesses outside Bolton?', 'Yes. We work with businesses across the North West and can discuss projects further afield too.'],
];

const STAGES = [
  ['01', 'Discover', 'Get to know you', 'We talk through your business, your audience and what you want your website or application to achieve.', ['Who you want to reach and what they need to do', 'What’s working now and what isn’t', 'Anything already in place that the project needs to connect to'], 'var(--amber)'],
  ['02', 'Define', 'Make a plan', 'We agree the platform, scope and priorities, with a tailored proposal before work begins.', ['What’s included, and what isn’t', 'The right platform or approach for the job', 'Costs and any ongoing fees'], '#FF8A3D'],
  ['03', 'Create', 'Design and build', 'We shape the experience, bring it to life and refine it with your feedback.', ['Structure and messaging', 'Design and build', 'Your feedback along the way'], 'var(--coral)'],
  ['04', 'Go live', 'Launch and support', 'We check the important details, launch your project and agree what happens next.', ['Checks on content, forms and devices', 'Launch', 'An agreed plan for ongoing care'], 'var(--violet)'],
];

const faqBlock = (list) => `<div>${list.map(([q, a]) => faq(q, a)).join('')}</div>`;
const cta = `<section class="section close" id="contact"><div class="wrap"><p class="eyebrow">Your next move</p><h2>Let’s make something work beautifully.</h2><p class="lede">A new website, an application idea or a digital experience that’s ready for more? Tell us what you have in mind.</p><div class="actions"><a class="btn btn-ink" href="/contact/">Start a conversation</a><a href="${TEL}">${PHONE}</a></div></div></section>`;

const pageHero = ({ eyebrow, h1, intro, actions = '' }) => `<div class="page-hero"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1>${intro ? `<p class="intro">${intro}</p>` : ''}${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;

const pages = [];

// Home
pages.push({ path: '/', title: 'Web Design & Custom Applications in Bolton | Managed Creative',
  desc: 'WordPress and Webflow websites and custom applications for businesses in Bolton and across the North West. Thoughtful design, built around your goals.',
  home: true,
  hero: `<div class="hero-body"><p class="eyebrow">Creative thinking. Connected expertise. Bolton, UK.</p><h1><span>Good websites.</span> <span>Better business.</span></h1><div class="hero-foot"><div class="hero-copy"><p>Thoughtful design, the right technology and a clear purpose. We create websites and applications that help your business do more online.</p><div class="actions"><a class="btn btn-solid" href="/contact/">Let’s talk</a><a class="btn btn-line" href="/services/">Explore services</a></div></div><svg class="ribbon" viewBox="0 28 222 120" aria-hidden="true" focusable="false"><defs><linearGradient id="rg" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="210" y2="0"><stop offset="0" stop-color="#FFC233"/><stop offset=".45" stop-color="#FF5A4E"/><stop offset="1" stop-color="#8B70FF"/></linearGradient></defs><circle class="d1" cx="12" cy="130" r="9"/><path class="s1" pathLength="1" d="M12 130C18 104 20 76 26 64"/><path class="s2" pathLength="1" d="M26 64C34 50 56 52 58 72C60 92 58 118 60 130"/><path class="s3" pathLength="1" d="M60 130C62 104 66 66 82 58C100 50 106 70 106 90C106 110 104 122 108 130C112 120 122 106 136 100"/><path class="s4" pathLength="1" d="M206 76C194 58 162 52 146 70C128 90 132 126 158 136C176 142 194 134 206 120"/><circle class="d2" cx="206" cy="76" r="9"/></svg></div></div>`,
  main: `<section class="section" id="services"><div class="wrap"><div class="svc-head"><div><p class="eyebrow">What we do</p><h2>The right digital solution for the way you work.</h2></div><p class="lede">Some businesses need a better website. Others need an application that makes a process simpler, or a brand and marketing that tell a clearer story. We help you choose the right approach for the job.</p></div>${SERVICES.map((s) => `<article class="svc" style="--c:${s.c}"><div><h3><a href="/services/${s.slug}/">${s.name}</a></h3><p class="tag">${s.tag}</p></div><div class="svc-body"><p>${s.a}</p><p>${s.b}</p><div class="home-svc-links"><a href="/services/${s.slug}/">More about ${s.name.toLowerCase().replace('wordpress','WordPress').replace('webflow','Webflow')}</a><a href="${mail(s.subject)}">${s.link}</a></div></div></article>`).join('')}</div></section>
<section class="section why" aria-labelledby="why-h"><div class="wrap why-grid"><div class="why-intro"><p class="eyebrow">More than a good-looking website</p><h2 id="why-h">Creative on the surface. Considered underneath.</h2><p class="lede">Great design is only the beginning. From a visitor’s first impression to the moment they make an enquiry or complete a task, every detail should have a job to do.</p><a class="btn btn-ink" href="/contact/">Tell us about your project</a></div><ul><li>${star}<h3>Clear by design</h3><p>Thoughtful structure and messaging help people understand what you do and what to do next.</p></li><li>${star}<h3>Made for real life</h3><p>Responsive layouts, accessible thinking and straightforward editing are considered from the start.</p></li><li>${star}<h3>Connected to your business</h3><p>Your website or application doesn’t exist in isolation. We consider the connections around it, from domains and hosting to forms, integrations and ongoing care. Where appropriate, we can discuss web hosting through Managed Web, part of the wider Managed Technology Group.</p></li></ul></div></section>
<section class="section approach dark"><div class="wrap"><p class="eyebrow">How we work</p><h2>Good work starts with a good conversation.</h2><p class="lede">No complicated hand-offs or mystery process. Just a clear route from your first idea to a digital solution that feels right.</p><ol class="steps">${STAGES.map(([n, t, sub, p], i) => `<li style="--dot:${['var(--amber-b)', '#FF8A3D', 'var(--coral)', 'var(--violet-b)'][i]}"><p class="n">${n}</p><h3>${t}</h3><p class="sub">${sub}</p><p>${p}</p></li>`).join('')}</ol><div class="actions"><a class="btn btn-line" href="/approach/">See our approach</a></div></div></section>
<section class="section"><div class="wrap faq-grid"><h2 class="h2-s">Frequently asked questions</h2><div>${faqBlock(FAQS.slice(0, 4))}<div class="actions"><a class="btn btn-ink" href="/faqs/">See all FAQs</a></div></div></div></section>${cta}` });

// Services index
pages.push({ path: '/services/', title: 'Services: Websites, Applications, Branding & Marketing | Managed Creative',
  desc: 'WordPress and Webflow websites, custom applications, branding and marketing for businesses in Bolton and across the North West.',
  hero: pageHero({ eyebrow: 'What we do', h1: 'The right digital solution for the way you work.', intro: 'Some businesses need a better website. Others need an application that makes a process simpler, or a brand and marketing that tell a clearer story. We help you choose the right approach for the job.' }),
  main: `<section class="section"><div class="wrap">${SERVICES.map((s) => `<article class="svc" style="--c:${s.c}"><div><h2 class="h2-s" style="max-width:none"><a href="/services/${s.slug}/" style="text-decoration:none">${s.name}</a></h2><p class="tag">${s.tag}</p></div><div class="svc-body"><p>${s.a}</p><a href="/services/${s.slug}/">More about ${s.name.toLowerCase().replace('wordpress','WordPress').replace('webflow','Webflow')}</a></div></article>`).join('')}</div></section>${cta}` });

// Service pages
for (const s of SERVICES) {
  const others = SERVICES.filter((o) => o !== s);
  pages.push({ path: `/services/${s.slug}/`, title: `${s.title} | Managed Creative`, desc: s.desc, current: '/services/',
    hero: pageHero({ eyebrow: `<a href="/services/">Services</a>`, h1: s.name, intro: s.a, actions: `<a class="btn btn-solid" href="${mail(s.subject)}">${s.link}</a>` }),
    main: `<section class="section" style="--c:${s.c}"><div class="wrap"><div class="split"><h2>${s.tag}</h2><div class="prose"><p>${s.b}</p><p>${s.note}</p></div></div><div class="split"><h2>A good fit when</h2><div>${ticks(s.fit)}</div></div><div class="split"><h2>What it can include</h2><div>${ticks(s.inc)}<p style="margin-top:1.5rem;max-width:62ch">Every project is different, so we’ll confirm the scope in a tailored proposal before work begins.</p></div></div></div></section>
<section class="section tint"><div class="wrap split"><h2>Related services</h2><div class="brands-wrap"><ul class="brands">${others.map((o) => `<li><b><a href="/services/${o.slug}/">${o.name}</a></b><span>${o.tag}</span></li>`).join('')}</ul></div></div></section>${cta}` });
}

// Approach
pages.push({ path: '/approach/', title: 'Our Approach | Managed Creative', desc: 'A clear route from your first idea to a digital solution that feels right: discover, define, create and go live.',
  hero: pageHero({ eyebrow: 'How we work', h1: 'Good work starts with a good conversation.', intro: 'No complicated hand-offs or mystery process. Just a clear route from your first idea to a digital solution that feels right.' }),
  main: `<section class="section"><div class="wrap">${STAGES.map(([n, t, sub, p, list, c]) => `<article class="stage" style="--c:${c}"><div><p class="n">${n}</p><h2>${t}</h2><p class="sub">${sub}</p></div><div class="prose"><p>${p}</p><p style="font-weight:700">What we’ll cover</p><ul class="bullets">${list.map((l) => `<li>${l}</li>`).join('')}</ul></div></article>`).join('')}</div></section>${cta}` });

// About
pages.push({ path: '/about/', title: 'About Us | Managed Creative', desc: 'Managed Creative is a Bolton creative studio and part of Managed Technology Group, a connected group of specialist technology brands.',
  hero: pageHero({ eyebrow: 'About Managed Creative', h1: 'Creative on the surface. Considered underneath.', intro: 'We’re a creative studio in Bolton, helping businesses with websites, applications, branding and marketing.' }),
  main: `<section class="section"><div class="wrap"><div class="split"><h2>What we care about</h2><div class="prose"><p>Great design is only the beginning. From a visitor’s first impression to the moment they make an enquiry or complete a task, every detail should have a job to do.</p><p>That’s why we start with what you’re trying to achieve, recommend what suits the job, and explain the options in plain English.</p></div></div><div class="split"><h2>Where it started</h2><div class="prose"><p>Managed Creative is built on the foundation of <b>Cre8ive Storm</b>, the original web design agency where everything began.</p><p>That work grew into a broader technology focus and, in time, Managed Technology Group. Managed Creative brings it back to where it started: good design, built around what a business needs.</p></div></div><div class="split"><h2>How we think</h2><div>${ticks(['<b>Clear by design.</b> Thoughtful structure and messaging help people understand what you do and what to do next.', '<b>Made for real life.</b> Responsive layouts, accessible thinking and straightforward editing are considered from the start.', '<b>Connected to your business.</b> We consider the connections around your project, from domains and hosting to forms, integrations and ongoing care.'])}</div></div></div></section>
<section class="section tint"><div class="wrap split"><div><h2>Part of Managed Technology Group</h2><p style="margin-top:1rem;max-width:40ch">Managed Creative is part of a connected group of specialist brands based in Bolton, each with a clear area of expertise.</p></div><ul class="brands"><li><b>Managed Creative</b><span>Marketing and creative design</span></li><li><b><a href="https://managedtech.uk/">Managed IT Support</a></b><span>Proactive IT support and monitoring</span></li><li><b><a href="https://managedweb.uk/">Managed Web</a></b><span>Websites and digital presence</span></li><li><b>Managed Comms</b><span>Business communications</span></li><li><b>Managed Consulting</b><span>Strategic IT and Zoho consultancy</span></li><li><b>Managed Cyber</b><span>Cyber security and threat protection</span></li></ul></div></section>${cta}` });

// FAQs
pages.push({ path: '/faqs/', title: 'Frequently Asked Questions | Managed Creative', desc: 'Answers on choosing a platform, custom applications, updating your website, hosting, costs and working with Managed Creative.',
  hero: pageHero({ eyebrow: 'FAQs', h1: 'Frequently asked questions', intro: 'If your question isn’t here, get in touch and we’ll talk it through.' }),
  main: `<section class="section"><div class="wrap">${faqBlock(FAQS)}</div></section>${cta}` });

// Contact
pages.push({ path: '/contact/', title: 'Contact Us | Managed Creative', desc: `Talk to Managed Creative in Bolton about a website, application, branding or marketing. Call ${PHONE} or email ${EMAIL}.`, noCta: true,
  hero: pageHero({ eyebrow: 'Your next move', h1: 'Let’s make something work beautifully.', intro: 'A new website, an application idea or a digital experience that’s ready for more? Tell us what you have in mind.' }),
  script: '/assets/contact.js',
  main: `<section class="section"><div class="wrap split"><div><div class="contact-ways"><div><h2>Email</h2><a class="big-link" href="${mail('Starting a conversation')}">${EMAIL}</a></div><div><h2>Phone</h2><a class="big-link" href="${TEL}">${PHONE}</a></div><div><h2>WhatsApp</h2><a class="big-link" href="${WA}">${WHATSAPP}</a></div><div><h2>Where we are</h2><p>St Peter’s House, Silverwell Street, Bolton, BL1 1PP</p></div></div><div class="prose contact-tips"><p>You don’t need a detailed brief. A rough idea is a good place to start, and we’ll help with the rest.</p><p>Looking for a domain or hosting? <a href="https://managedweb.uk/">Managed Web</a> is the place to go.</p></div></div>
<form class="enquiry" id="enquiry" action="https://desk.zoho.uk/support/WebToCase" method="post" enctype="multipart/form-data" accept-charset="UTF-8">
<h2>Send us an enquiry</h2>
<input type="hidden" name="xnQsjsdp" value="edbsn5a47fcdc5e4a4ea9758b903b425bcf51"><input type="hidden" name="xmIwtLD" value="edbsn6983a173f0089a1deb9f156ef4aa38f7"><input type="hidden" name="xJdfEaS" value=""><input type="hidden" name="actionType" value="Q2FzZXM="><input type="hidden" name="returnURL" value="${ORIGIN}/thanks/"><input type="hidden" name="zsCaptchaSrc" value="">
<div class="field-row"><div class="field"><label for="f-first">First name</label><input id="f-first" name="First Name" type="text" maxlength="120" autocomplete="given-name"></div><div class="field"><label for="f-last">Last name <span>(required)</span></label><input id="f-last" name="Contact Name" type="text" maxlength="120" required autocomplete="family-name"></div></div>
<div class="field-row"><div class="field"><label for="f-email">Email <span>(required)</span></label><input id="f-email" name="Email" type="email" maxlength="120" required autocomplete="email"></div><div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="Phone" type="tel" maxlength="120" autocomplete="tel"></div></div>
<div class="field"><label for="f-subject">What’s it about? <span>(required)</span></label><input id="f-subject" name="Subject" type="text" maxlength="255" required></div>
<div class="field"><label for="f-message">Tell us what you have in mind</label><textarea id="f-message" name="Description" rows="6" maxlength="5000"></textarea></div>
<div class="field captcha"><label for="f-captcha">Enter the characters shown <span>(required)</span></label><div class="captcha-row"><img id="captcha-img" alt="Security check characters" width="150" height="50"><button type="button" class="link-btn" id="captcha-new">Show different characters</button></div><input id="f-captcha" name="zsWebFormCaptchaWord" type="text" maxlength="10" required autocomplete="off"></div>
<p class="form-note" id="form-status" role="status" aria-live="polite"></p>
<p class="form-note">We’ll use your details to reply to your enquiry. See our <a href="/privacy/">privacy policy</a>.</p>
<button class="btn btn-ink" id="enquiry-send" type="submit">Send enquiry</button>
<noscript><p class="form-note">This form needs JavaScript for its security check. You can email <a href="mailto:${EMAIL}">${EMAIL}</a> instead.</p></noscript>
</form></div></section>` });

// Thanks
pages.push({ path: '/thanks/', title: 'Thanks | Managed Creative', desc: 'Your enquiry has been sent to Managed Creative.', noCta: true, noindex: true,
  hero: pageHero({ eyebrow: 'Enquiry sent', h1: 'Thanks for getting in touch.', intro: 'We’ve received your enquiry and will be in touch.', actions: `<a class="btn btn-line" href="/">Back to the homepage</a>` }),
  main: `<section class="section"><div class="wrap prose"><p>Need to add something? Email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="${TEL}">${PHONE}</a>.</p></div></section>` });

// Bolton
pages.push({ path: '/web-design-bolton/', title: 'Web Design in Bolton | Managed Creative', desc: 'Web design in Bolton from Managed Creative: WordPress and Webflow websites, custom applications, branding and marketing for local businesses.', current: '/services/',
  hero: pageHero({ eyebrow: 'Bolton, North West England', h1: 'Web design in Bolton', intro: 'Thoughtful design, the right technology and a clear purpose, from a creative studio based in Bolton.', actions: `<a class="btn btn-solid" href="/contact/">Let’s talk</a>` }),
  main: `<section class="section"><div class="wrap"><div class="split"><h2>A local studio with connected expertise</h2><div class="prose"><p>We’re based in Bolton and work with businesses across the North West. We can also discuss projects further afield.</p><p>Whether you need a new website, a redesign or an application that makes a process simpler, we’ll start with a conversation about your business and what you want to achieve.</p><p>We’re part of Managed Technology Group, so we can also consider the connections around your project, from domains and hosting to forms, integrations and ongoing care.</p></div></div><div class="split"><h2>How we can help</h2><ul class="brands">${SERVICES.map((o) => `<li><b><a href="/services/${o.slug}/">${o.name}</a></b><span>${o.tag}</span></li>`).join('')}</ul></div></div></section>${cta}` });

// Privacy
pages.push({ path: '/privacy/', title: 'Privacy Policy | Managed Creative', desc: 'How Managed Creative, a trading name of Managed Technology Group Limited, uses personal data.', noCta: true,
  hero: pageHero({ eyebrow: 'Last updated: 2 November 2026', h1: 'Privacy policy' }),
  main: `<section class="section"><div class="wrap"><div class="prose">
<h2>Who we are</h2><p>Managed Creative is a trading name of Managed Technology Group Limited (company number 17115757), St Peter’s House, Silverwell Street, Bolton, BL1 1PP. We are the data controller for the personal data described in this policy.</p><p>Email <a href="mailto:${EMAIL}">${EMAIL}</a> or call <a href="${TEL}">${PHONE}</a> with any privacy questions.</p>
<h2>What we collect</h2><ul class="bullets"><li><b>Enquiries:</b> your name, contact details and anything else you tell us when you complete our enquiry form, email or call.</li><li><b>Technical data:</b> your IP address, browser type and the pages requested, which are processed when you visit this website.</li></ul><p>This website has no analytics and doesn’t set cookies of its own.</p>
<h2>Why we use it</h2><ul class="bullets"><li>To respond to your enquiry and take steps towards working together (contract or legitimate interests).</li><li>To deliver and secure this website (legitimate interests).</li><li>To meet our legal obligations (legal obligation).</li></ul>
<h2>Who we share it with</h2><p>We don’t sell your data. We use service providers who process it for us:</p><ul class="bullets"><li><b>Cloudflare</b>, which hosts and secures this website.</li><li><b>Google</b>, whose Google Fonts service supplies this website’s font. Your browser’s request, including your IP address, goes to Google.</li><li><b>Zoho</b>, whose Zoho Desk service receives and stores enquiries from our form and email, and provides the form’s security check.</li><li><b>Our email, customer relationship and accounting providers</b>, if you contact us or become a client.</li></ul><p>Some of these providers may transfer data outside the UK. Where they do, appropriate safeguards are used.</p>
<h2>How long we keep it</h2><p>We keep enquiry data for 24 months from your last contact unless we enter into an agreement with you. We keep client data for the length of the agreement plus 6 years to meet legal and accounting requirements.</p>
<h2>Your rights</h2><p>Under UK data protection law you can ask to access, correct or delete your personal data, restrict or object to how we use it, and receive a copy in a portable format. Email us to make a request.</p><p>You can also complain to the Information Commissioner’s Office at <a href="https://ico.org.uk/">ico.org.uk</a> or on 0303 123 1113.</p>
<h2>Changes to this policy</h2><p>We’ll post any changes on this page and update the date at the top.</p>
</div></div></section>` });

// Shell
const NAV = [['/services/', 'Services'], ['/approach/', 'Our approach'], ['/about/', 'About'], ['/faqs/', 'FAQs'], ['/contact/', 'Start a project']];
const render = (p) => {
  const cur = p.current || p.path;
  const url = ORIGIN + p.path;
  const ld = p.home ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Managed Creative', legalName: 'Managed Technology Group Limited', url: ORIGIN + '/', logo: ORIGIN + '/assets/managed-creative-logo.svg', telephone: '+441204954050', email: EMAIL, address: { '@type': 'PostalAddress', streetAddress: 'St Peter’s House, Silverwell Street', addressLocality: 'Bolton', postalCode: 'BL1 1PP', addressCountry: 'GB' }, areaServed: 'North West England' })}</script>` : '';
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title.replace(/&/g, '&amp;')}</title>
<meta name="description" content="${p.desc}">${p.noindex ? '\n<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#00001F">
<meta property="og:type" content="website">
<meta property="og:locale" content="en_GB">
<meta property="og:site_name" content="Managed Creative">
<meta property="og:title" content="${p.title.replace(/&/g, '&amp;')}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap">
<link rel="stylesheet" href="/assets/site.css">
${ld}${p.script ? `\n<script src="${p.script}" defer></script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="star" viewBox="0 0 24 24"><path d="M12 0l3.2 8.8L24 12l-8.8 3.2L12 24l-3.2-8.8L0 12l8.8-3.2z"/></symbol></defs></svg>
<header class="hero dark"><div class="wrap">
<nav class="top" aria-label="Main"><a href="/"><img src="/assets/managed-creative-logo-reversed.svg" width="646" height="218" alt="Managed Creative home"></a><ul>${NAV.map(([h, t]) => `<li><a href="${h}"${cur === h ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul></nav>
${p.hero}
</div>${p.home ? '' : '<div class="hero-line"></div>'}</header>
<main id="main">
${p.main}
</main>
<footer class="dark"><div class="wrap">
<div class="foot">
<div><img src="/assets/managed-creative-logo-reversed.svg" width="646" height="218" alt="Managed Creative"><p>Creative design, connected to Managed Technology Group.</p><p>Bolton, North West England.</p><p class="credit">Built on the foundation of Cre8ive Storm.</p></div>
<div><h3>Services</h3><ul>${SERVICES.map((s) => `<li><a href="/services/${s.slug}/">${s.name}</a></li>`).join('')}<li><a href="/web-design-bolton/">Web design in Bolton</a></li></ul></div>
<div><h3>Company</h3><ul><li><a href="/approach/">Our approach</a></li><li><a href="/about/">About</a></li><li><a href="/faqs/">FAQs</a></li><li><a href="/contact/">Contact</a></li><li><a href="https://managedweb.uk/">Managed Web</a></li></ul></div>
<div><h3>Contact</h3><a href="${TEL}">${PHONE}</a><br>WhatsApp <a href="${WA}">${WHATSAPP}</a><br><a href="mailto:${EMAIL}">${EMAIL}</a></div>
</div>
<div class="legal-line"><p>Managed Creative is a trading name of Managed Technology Group Limited, company number 17115757. St Peter’s House, Silverwell Street, Bolton, BL1 1PP.</p><a href="/privacy/">Privacy policy</a></div>
</div></footer>
</body>
</html>
`;
};

for (const p of pages) {
  const file = join('public', p.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, render(p));
}
copyFileSync('src/site.css', 'public/assets/site.css');
copyFileSync('src/contact.js', 'public/assets/contact.js');
writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter((p) => !p.noindex).map((p) => `<url><loc>${ORIGIN}${p.path}</loc></url>`).join('')}</urlset>\n`);
console.log(pages.length, 'pages');
