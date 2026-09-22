export function canRegisterServiceWorker(environment:string,protocol:string){return environment==='production'&&['https:','http:'].includes(protocol)}
export async function registerPwa(){if(!('serviceWorker'in navigator)||!canRegisterServiceWorker(import.meta.env.MODE,location.protocol))return null;return navigator.serviceWorker.register('/service-worker.js',{scope:'/'})}
