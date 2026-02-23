import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Random "mo:core/Random";
import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";

actor {
  type Contact = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type UserProfile = {
    username : Text;
    contacts : [Contact];
  };

  let profiles = Map.empty<Principal, UserProfile>();

  // Invite links setup
  let inviteLinksState = InviteLinksModule.initState();

  // Access control setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Application-specific functions
  public shared ({ caller }) func register(username : Text) : async () {
    if (username.trim(#char ' ').size() == 0) {
      Runtime.trap("Username cannot be empty or whitespace");
    };

    switch (profiles.get(caller)) {
      case (?_) { Runtime.trap("Profile already exists for this user") };
      case (null) {
        let profile : UserProfile = {
          username;
          contacts = [];
        };
        profiles.add(caller, profile);
      };
    };
  };

  public query ({ caller }) func getProfile(id : Principal) : async UserProfile {
    if (caller != id and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (profiles.get(id)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func addContact(name : Text, email : Text, phone : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add contacts");
    };

    let callerProfile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Only registered users can add contacts") };
      case (?p) { p };
    };

    let newContact : Contact = {
      name;
      email;
      phone;
    };

    let updatedContacts = callerProfile.contacts.concat([newContact]);
    let updatedProfile = {
      callerProfile with
      contacts = updatedContacts;
    };
    profiles.add(caller, updatedProfile);
  };

  // Required component functions
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteLinksState, code);
    code;
  };

  public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteLinksState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteLinksState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteLinksState);
  };

  public query ({ caller }) func getContacts() : async [Contact] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get contacts");
    };

    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Only registered users can get contacts") };
      case (?profile) { profile.contacts };
    };
  };
};
