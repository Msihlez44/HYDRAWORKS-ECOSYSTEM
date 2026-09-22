import{describe,expect,it}from'vitest';import{publicProduct,qrCodeUrl,storefrontSchema,storefrontUrl}from'../../src/storefront';
describe('KASIBIZ storefront',()=>{
  it('requires a contact option before publishing',()=>{expect(()=>storefrontSchema.parse({slug:'my-shop',published:true,description:'A trusted local shop.',openingHours:'Mon-Fri',serviceArea:'Durban'})).toThrow(/contact/)});
  it('creates a canonical public link and encoded QR source',()=>{const url=storefrontUrl('https://hydra.example/','my-shop');expect(url).toBe('https://hydra.example/shop/my-shop');expect(qrCodeUrl(url)).toContain(encodeURIComponent(url))});
  it('only maps owner-approved product fields',()=>{expect(publicProduct({id:'1',name:'Bread',category:'Food',sellingPriceCents:1800,publicDescription:'Fresh',imageUrl:null})).toEqual({id:'1',name:'Bread',category:'Food',priceCents:1800,description:'Fresh',imageUrl:null})});
  it('rejects unsafe storefront slugs',()=>{expect(()=>storefrontSchema.parse({slug:'My Shop!',published:false,description:'A trusted local shop.',openingHours:'Daily',serviceArea:'Local'})).toThrow()});
});
