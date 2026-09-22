import{describe,expect,it}from'vitest';import{supportedLocales,translate}from'./i18n';
describe('localisation',()=>{
  it('ships reviewed English as the default',()=>{expect(translate('en','nav.overview')).toBe('Overview')});
  it('falls back to reviewed English for pending languages',()=>{expect(translate('zu','nav.overview')).toBe('Overview')});
  it('interpolates values safely',()=>{expect(translate('en','dashboard.welcome',{name:'Lindiwe'})).toBe('Welcome, Lindiwe')});
  it('prepares every requested language without fake translations',()=>{expect(supportedLocales.map(x=>x.code)).toEqual(['en','zu','xh','st','tn','af','nso','ve','ss','nr']);expect(supportedLocales.filter(x=>x.ready).map(x=>x.code)).toEqual(['en'])});
});
