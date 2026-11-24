import test from "node:test";
import assert from "node:assert/strict";
import { deliveryDays, noteLabel, offerTime, party, responseOwner, threadOrigin } from "../src/lib/negotiation-presentation.js";

const thread = {
  project:{clientId:"buyer",client:{id:"buyer",name:"Northline Coffee"}},
  freelancerId:"studio",freelancer:{id:"studio",name:"Avery Sen"}, status:"PENDING",kind:"INVITATION",
};

test("roles and negotiation origin stay distinct when the counteroffer changes hands",()=>{
  assert.equal(threadOrigin(thread),"Client");
  assert.equal(threadOrigin({...thread,kind:"PROPOSAL"}),"Freelancer");
  assert.equal(party(thread,"studio").person.name,"Avery Sen");
  assert.equal(party(thread,"buyer").role,"Client");
  assert.equal(party(thread,"other"),null);
  assert.equal(responseOwner(thread,{recipientId:"studio"}).role,"Freelancer");
  assert.equal(responseOwner(thread,{recipientId:"buyer"}).role,"Client");
  for (const status of ["ACCEPTED","REJECTED","WITHDRAWN","CLOSED"]) {
    assert.equal(responseOwner({...thread,status},{recipientId:"buyer"}),null);
  }
});

test("offer instants display the UTC day and minute independently of caller offset",()=>{
  assert.equal(offerTime("2026-12-31T23:55:00-05:00"),"1 Jan 2027, 04:55 UTC");
  assert.equal(offerTime(new Date("2027-01-01T04:55:00Z")),"1 Jan 2027, 04:55 UTC");
  assert.equal(offerTime(null),"Time unavailable");
  assert.equal(deliveryDays(1),"1 day");
  assert.equal(deliveryDays(20),"20 days");
});

test("only the original proposal note is labelled as a cover letter",()=>{
  assert.equal(noteLabel("PROPOSAL",1),"Cover letter");
  assert.equal(noteLabel("PROPOSAL",2),"Negotiation note");
  assert.equal(noteLabel("INVITATION",1),"Negotiation note");
});
