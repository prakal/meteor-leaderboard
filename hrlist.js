console.log("Hello world");
PeopleList=new Mongo.Collection('people');
if (Meteor.isClient){
  Meteor.subscribe('thePeople');
  // this code only runs on Client side
  console.log("Hello Client!");
  Template.peep_list.helpers({
    'person': function(){
        return PeopleList.find({},{sort: {score:-1,name:1}});
    },
    'selectedClass':function(){
      //code goes here
      if (this._id==Session.get('sel_person'))
        return "selected";
    },
    'showSelectedPerson':function(){
      //code goes here
      return PeopleList.findOne(Session.get('sel_person'));
    },
    'indexSelectedPerson':function(){
      var whole_list=PeopleList.find({},{sort: {score:-1,name:1}}).fetch();
      var i=0;
      var a=Session.get('sel_person');
      while (i<whole_list.length){
        //console.log(i,a,whole_list[i]._id);
          if (a==whole_list[i]._id){
            console.log('Index is:',i);
            break;
            if (i>0){
                        Session.set('sel_person',whole_list[i-1]);
                      }
          }
          else{
            i++;
          }
        }    
      }

  });

  Template.peep_list.events({
    //events go here
    'click .person': function(){
      //code goes here
      Session.set('sel_person',this._id);
    },
    'click .increment': function(){
      var a=Session.get('sel_person');
      Meteor.call('modifyScore',a,5);
      
    },
    'click .decrement': function(){
      var a=Session.get('sel_person');
      Meteor.call('modifyScore',a,-5);
    },
    'click .remove':function(){
      var a=Session.get('sel_person');
      Meteor.call('removePersonData',a);
    }
  });
  Template.addPersonForm.events({
    'submit form' : function(event){
      var whole_list=PeopleList.find({},{sort: {score:-1,name:1}}).fetch();
        event.preventDefault();
        if (whole_list.length<7){
          console.log(event.target.PersonName.value,event.target.Score.value,Meteor.userId());
          Meteor.call('insertPersonData',event.target.PersonName.value,event.target.Score.value,Meteor.userId());
          event.target.PersonName.value='';
          event.target.Score.value='';
        }
        else{
          event.target.PersonName.value='';
          event.target.Score.value='';
          window.alert("Cannot add any more people!")
        }
    }

  });
/*
  Template.peep_list.rendered = function() { 
        // Assuming you're using jQuery 
        $('body').on('keydown',function(e) { 
                console.log(e.which);
                console.log(Session.get('sel_person'));
        }); 
  } 
*/
}
if (Meteor.isServer){
  // this code only runs on Client side
  console.log("Hello Server!");
  Meteor.publish('thePeople', function(){
    return PeopleList.find({createdBy: this.userId})
  });
  Meteor.methods({
    'sendLogMessage':function(){
      console.log('Hey man');
    },
    'insertPersonData':function(name,score,creator){
      PeopleList.insert({
          name:name,
          score:parseInt(score),
          createdBy:creator
        });
    },
    'removePersonData':function(person){
      PeopleList.remove(person);
    },
    'modifyScore':function(person,increment){
      PeopleList.update(person,{$inc: {score:increment}});
    }
  });


}
