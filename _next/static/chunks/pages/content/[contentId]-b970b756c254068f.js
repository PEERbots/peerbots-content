(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[450],{6606:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/content/[contentId]",function(){return t(5180)}])},5180:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return f}});var s=t(5666),r=t.n(s),a=t(5893),c=t(1163),i=t(4467),o=t(5321),l=t(7294),d=t(4603),u=t(1664),h=t(1132),x=t(6688);function p(e,n,t,s,r,a,c){try{var i=e[a](c),o=i.value}catch(l){return void t(l)}i.done?n(o):Promise.resolve(o).then(s,r)}function m(e){return function(){var n=this,t=arguments;return new Promise((function(s,r){var a=e.apply(n,t);function c(e){p(a,s,r,c,i,"next",e)}function i(e){p(a,s,r,c,i,"throw",e)}c(void 0)}))}}function f(){var e=(0,x.h)(),n=e.user,t=e.userInDb,s=(0,l.useState)({}),p=s[0],f=s[1],v=(0,l.useState)({}),w=v[0],j=v[1],b=(0,l.useState)([]),g=b[0],k=b[1],N=(0,l.useState)([]),y=N[0],C=N[1],J=(0,l.useState)(null),O=J[0],U=J[1],L=(0,l.useState)(null),E=L[0],S=L[1],I=(0,l.useState)([]),D=I[0],P=I[1],_=(0,l.useState)(!1),M=_[0],B=_[1],V=(0,l.useState)(!1),z=V[0],A=V[1],T=(0,l.useState)([]),q=T[0],R=T[1],W=(0,l.useState)(!1),F=W[0],Z=W[1],K=(0,l.useState)(!1),Q=K[0],X=K[1],Y=(0,l.useRef)(),H=(0,l.useRef)(),G=(0,l.useRef)(),$=(0,o.ad)(i.Z),ee=(0,c.useRouter)(),ne=ee.query.contentId,te=m(r().mark((function e(n){var t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.preventDefault(),t=(0,o.JU)($,"content",ne),e.next=4,(0,o.r7)(t,{name:Y.current.value});case 4:Z(!1),pe();case 6:case"end":return e.stop()}}),e)}))),se=m(r().mark((function e(n){var t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.preventDefault(),t=(0,o.JU)($,"content",ne),e.next=4,(0,o.r7)(t,{description:H.current.value});case 4:X(!1),pe();case 6:case"end":return e.stop()}}),e)}))),re=m(r().mark((function e(n){var t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!M){e.next=5;break}return t=(0,o.JU)($,"content",ne),e.next=4,(0,o.r7)(t,{public:!0,price:0});case 4:pe();case 5:case"end":return e.stop()}}),e)}))),ae=m(r().mark((function e(n){var s,a,c;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n.preventDefault(),s=G.current.value,(a=p).name=s,a.originalName=p.name,a.copyOf=(0,o.JU)($,"content",ne),a.copyDate=o.EK.now(),a.public=!1,a.trusted=!1,a.owner=(0,o.JU)($,"users",t.id),e.next=12,(0,o.ET)((0,o.hJ)($,"content"),a);case 12:c=e.sent,ee.push("/content/".concat(c.id));case 14:case"end":return e.stop()}}),e)}))),ce=m(r().mark((function e(n){var s,a;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t&&Object.keys(t).length>0)){e.next=12;break}if(t.id!=n.owner.id){e.next=5;break}return B(!0),A(!1),e.abrupt("return",!0);case 5:return B(!1),s=(0,o.IO)((0,o.hJ)($,"sales"),(0,o.ar)("content","==",(0,o.JU)($,"content",ne)),(0,o.ar)("buyer","==",(0,o.JU)($,"users",t.id)),(0,o.b9)(1)),e.next=9,(0,o.PL)(s);case 9:return a=e.sent,A(a.docs.length>0),e.abrupt("return",a.docs.length>0);case 12:case"end":return e.stop()}}),e)}))),ie=m(r().mark((function e(){return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(M||z){e.next=5;break}return e.next=3,(0,o.ET)((0,o.hJ)($,"sales"),{buyer:(0,o.JU)($,"users",t.id),content:(0,o.JU)($,"content",ne),datetime:o.EK.now()});case 3:e.sent,A(!0);case 5:case"end":return e.stop()}}),e)}))),oe=m(r().mark((function e(){var n,s,a;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,o.IO)((0,o.hJ)($,"content"),(0,o.ar)("copyOf","==",(0,o.JU)($,"content",ne)),(0,o.ar)("owner","==",(0,o.JU)($,"users",t.id))),e.next=3,(0,o.PL)(n);case 3:s=e.sent,a=s.docs.map((function(e){return{id:e.id,data:e.data()}})),R(a);case 6:case"end":return e.stop()}}),e)}))),le=m(r().mark((function e(n){var t,s,a;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=(0,o.JU)($,"users",n.owner.id),e.next=3,(0,o.QT)(t);case 3:s=e.sent,a=s.data(),j(a);case 6:case"end":return e.stop()}}),e)}))),de=m(r().mark((function e(n){var t,s,a,c;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.tags.map((function(e){return e.id})),s=(0,o.IO)((0,o.hJ)($,"tags"),(0,o.ar)((0,o.Jm)(),"in",t)),e.next=4,(0,o.PL)(s);case 4:a=e.sent,c=a.docs.map((function(e){return{id:e.id,data:e.data()}})),P(c);case 7:case"end":return e.stop()}}),e)}))),ue=m(r().mark((function e(){var n,t,s,a,c,i,l,d;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,o.JU)($,"content",ne),t=(0,o.IO)((0,o.hJ)($,"reviews"),(0,o.ar)("content","==",n)),e.next=4,(0,o.PL)(t);case 4:if(s=e.sent,a=s.docs.map((function(e){return{id:e.id,data:e.data()}})),!((c=a.map((function(e){return e.data.user.id}))).length>0)){e.next=17;break}return i=(0,o.IO)((0,o.hJ)($,"users"),(0,o.ar)((0,o.Jm)(),"in",c)),e.next=11,(0,o.PL)(i);case 11:l=e.sent,d=l.docs.map((function(e){return{id:e.id,data:e.data()}})),C(d),k(a),e.next=18;break;case 17:C([]),k([]);case 18:case"end":return e.stop()}}),e)}))),he=m(r().mark((function e(){var n,t,s;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,o.JU)($,"content",ne),t=(0,o.IO)((0,o.hJ)($,"sales"),(0,o.ar)("content","==",n)),e.next=4,(0,o.PL)(t);case 4:s=e.sent,S(s.docs.length);case 6:case"end":return e.stop()}}),e)}))),xe=m(r().mark((function e(){var n,t,s;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,o.JU)($,"content",ne),t=(0,o.IO)((0,o.hJ)($,"content"),(0,o.ar)("copyOf","==",n)),e.next=4,(0,o.PL)(t);case 4:s=e.sent,U(s.docs.length);case 6:case"end":return e.stop()}}),e)}))),pe=m(r().mark((function e(){var n,t;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!ne){e.next=6;break}return n=(0,o.JU)($,"content",ne),e.next=4,(0,o.QT)(n);case 4:(t=e.sent).exists()?f(t.data()):ee.push("/404","/not-found");case 6:case"end":return e.stop()}}),e)})));return(0,l.useEffect)((function(){pe()}),[ne]),(0,l.useEffect)((function(){p&&0!=Object.keys(p).length&&(le(p),de(p),ue(),he(),xe())}),[p]),(0,l.useEffect)((function(){(n||R([]),p&&t&&0!=Object.keys(p).length&&0!=Object.keys(t).length)&&(ce(p)&&oe())}),[p,n,t]),(0,l.useEffect)((function(){d.Z.getInstance().logEvent("Viewed Page: Content Details",{"Content ID":ne})}),[]),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{className:"text-2xl",children:p.name}),n&&M&&(0,a.jsxs)("button",{className:"border border-gray-400 mx-2 p-2 hover:bg-gray-400 hover:text-white rounded",onClick:function(){Z(!0)},children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 inline-block",viewBox:"0 0 20 20",fill:"currentColor",children:(0,a.jsx)("path",{d:"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"})})," ","Edit"]})]}),F&&(0,a.jsx)("div",{children:(0,a.jsxs)("form",{onSubmit:te,children:[(0,a.jsx)("label",{children:"New Name"}),(0,a.jsx)("input",{type:"text",ref:Y,className:"input-base form-input",name:"updatedName",defaultValue:p.name}),(0,a.jsxs)("button",{className:"btn-primary",type:"submit",onClick:te,children:[" ","Update Name"]}),(0,a.jsx)("button",{onClick:function(){Z(!1)},children:"Cancel"})]})}),(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{className:"text-xs",children:"Authored by"}),w?(0,a.jsxs)("div",{className:"text-gray-800",children:[(0,a.jsx)("span",{children:w.photoUrl?(0,a.jsx)("img",{src:w.photoUrl,className:"h-8 inline-block rounded-full"}):(0,a.jsx)("img",{src:"profile_pic.png",className:"h-8 inline-block rounded-full"})}),(0,a.jsx)("span",{className:"ml-1 text-base",children:w.name})]}):(0,a.jsx)("div",{})]}),(0,a.jsx)("div",{className:"my-2",children:!p.copyOf&&p.public&&g?(0,a.jsx)(a.Fragment,{children:g.length>0?(0,a.jsxs)("span",{children:[(0,a.jsxs)("span",{className:"text-accent-hc font-bold px-2 text-base",children:[g.reduce((function(e,n){return e+n.data.rating}),0)/g.length,(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 inline-block",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"})})]}),(0,a.jsxs)("span",{className:"text-sm",children:["(",g.length," reviews)"]})]}):(0,a.jsx)("span",{className:"text-xs",children:"No reviews yet"})}):(0,a.jsx)("span",{children:""})}),(0,a.jsx)("div",{className:"my-2",children:D&&D.map((function(e){return(0,a.jsx)("span",{style:{background:e.data.color,color:e.data.textColor},className:"rounded-3xl px-2 mx-1 text-xs",children:e.data.name},e.id)}))})]}),(0,a.jsxs)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4 ",children:[(0,a.jsxs)("div",{children:[p.description,n&&M&&(0,a.jsxs)("button",{className:"border border-gray-400 mx-2 p-2 hover:bg-gray-400 hover:text-white rounded",onClick:function(){X(!0)},children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 inline-block",viewBox:"0 0 20 20",fill:"currentColor",children:(0,a.jsx)("path",{d:"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"})})," ","Edit"]})]}),Q&&(0,a.jsx)("div",{children:(0,a.jsxs)("form",{onSubmit:se,children:[(0,a.jsx)("label",{children:"New Description"}),(0,a.jsx)("textarea",{type:"text",ref:H,className:"input-base form-input",name:"updatedDescription",defaultValue:p.description}),(0,a.jsxs)("button",{className:"btn-primary",type:"submit",onClick:se,children:[" ","Update Description"]}),(0,a.jsx)("button",{onClick:function(){X(!1)},children:"Cancel"})]})})]}),n&&M&&!p.copyOf&&!p.public&&(0,a.jsxs)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4",children:[(0,a.jsx)("div",{className:"text-base",children:"Would you like to list this content publicly?"}),(0,a.jsxs)("div",{className:"text-sm",children:["Listing content will make it publicly available to others for free! Listing content publicly will allow others to copy it and use it on the Peerbots app."," "]}),(0,a.jsx)("div",{className:"text-sm font-bold",children:"Once content is public it can not be made private."}),(0,a.jsx)("div",{children:(0,a.jsx)("button",{className:"btn-primary",onClick:re,children:"List this publicly for free!"})})]}),p.public&&!p.copyOf&&g.length>0&&(0,a.jsx)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4 ",children:(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-sm font-bold",children:"Reviews"}),g.map((function(e){return(0,a.jsxs)("div",{className:"bg-white shadow-lg rounded p-4 w-64",children:[(0,a.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,a.jsxs)("div",{children:[e.data.rating," ",(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 inline-block",viewBox:"0 0 20 20",fill:"currentColor",children:(0,a.jsx)("path",{d:"M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"})})]}),(0,a.jsxs)("div",{className:"align-middle",children:[(0,a.jsx)("span",{children:(0,a.jsx)("img",{src:y.filter((function(n){return n.id==e.data.user.id}))[0].data.photoUrl,className:"rounded-full h-6 w-6 inline-block mr-1"})}),(0,a.jsx)("span",{className:"text-sm",children:y.filter((function(n){return n.id==e.data.user.id}))[0].data.name})]})]}),(0,a.jsx)("div",{className:"text-sm text-gray-700",children:e.data.description})]},e.id)}))]})}),p.public&&!p.copyOf&&(0,a.jsxs)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4 ",children:[(0,a.jsx)("div",{children:g&&g.length>0?(0,a.jsxs)("span",{children:[(0,a.jsxs)("span",{className:"text-accent-hc font-bold px-2 text-base",children:[g.reduce((function(e,n){return e+n.data.rating}),0)/g.length,(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 inline-block",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"})})]}),(0,a.jsxs)("span",{className:"text-sm",children:["(",g.length," reviews)"]})]}):(0,a.jsx)("span",{className:"text-xs",children:"No reviews yet"})}),(0,a.jsx)("div",{children:0==p.price?(0,a.jsx)("span",{className:"uppercase",children:"Free"}):(0,a.jsx)("span",{children:new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(p.price)})}),(0,a.jsx)("div",{children:E&&(0,a.jsxs)("span",{children:[" ",(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 inline-block",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"})}),E," sales"," "]})}),(0,a.jsx)("div",{children:O&&(0,a.jsxs)("span",{children:[(0,a.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 inline-block",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:(0,a.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"})}),O," copies"]})}),n?(0,a.jsx)(a.Fragment,{children:!(M||z)&&(0,a.jsxs)("div",{children:[(0,a.jsx)("button",{className:"btn-primary",onClick:function(){d.Z.getInstance().logEvent("Clicked Button: Content Details - Acquire Content",{"Content ID":ne}),ie()},children:"+ Acquire Content"})," "]})}):(0,a.jsxs)("div",{children:[(0,a.jsx)("span",{className:"text-sm",children:"You must sign in to acquire content."}),(0,a.jsx)("button",{className:"btn-primary",disabled:!0,children:"+ Acquire Content"})]})]}),p.copyOf&&(0,a.jsx)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4",children:(0,a.jsxs)("span",{children:["This is a copy of"," ",(0,a.jsx)(u.default,{href:"/content/[contentId]",as:"/content/".concat(p.copyOf.id),children:"original content link"})]})}),n&&(M||z)&&(0,a.jsx)("div",{className:"bg-white shadow-md my-4 mx-2 rounded p-4",children:(0,a.jsxs)("form",{onSubmit:ae,children:[(0,a.jsx)("label",{children:"Copy As"}),(0,a.jsx)("input",{type:"text",ref:G,className:"input-base form-input",name:"copyAs",defaultValue:"Copy of ".concat(p.name)}),(0,a.jsxs)("button",{className:"btn-primary",type:"submit",onClick:ae,children:[" ","Copy to App!"]})]})}),(0,a.jsx)("div",{children:q.length>0?(0,a.jsx)("div",{children:(0,a.jsx)(h.Z,{content:q,children:(0,a.jsx)("h3",{children:"Your copies"})})}):(0,a.jsx)("div",{children:""})})]})}}},function(e){e.O(0,[132,774,888,179],(function(){return n=6606,e(e.s=n);var n}));var n=e.O();_N_E=n}]);