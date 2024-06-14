import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import NFTActorClass "../NFT/nft";
import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat"; 
import Bool "mo:base/Bool";
import Iter "mo:base/Iter";



actor PixelPort {
  // IN THIS WE ARE GOING TO CREATE THE SIMILAR THING THAT WE DID IN COMMAND LINE, BUT USING BACKEND.

  // Debug.print("Just Restarting");

  private type Listing = { 
    itemOwner:Principal;
    itemPrice:Nat;
  };

  var mapofNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapofOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);

  public shared(msg) func mint(imageData:[Nat8], name:Text): async Principal{

    let owner:Principal = msg.caller;
    Debug.print(debug_show(Cycles.balance()));
    Cycles.add<system>(100_500_000_000);
    // 'newNFT' IS AN ACTOR CLASS WHICH IS USED TO CALL THE FUNCTION PRESENT IN nft.mo
    let newNFT = await NFTActorClass.NFT(name,owner,imageData);
    let newNFTPrincipal = await newNFT.getCanisterId();
    Debug.print(debug_show(Cycles.balance()));

    mapofNFTs.put(newNFTPrincipal, newNFT);
    addToOwnershipMap(owner, newNFTPrincipal);

    return newNFTPrincipal;
  };

  public func addToOwnershipMap(owner:Principal, nftId:Principal){
    

    var ownedNFTs : List.List<Principal> = switch(mapofOwners.get(owner)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    ownedNFTs := List.push(nftId, ownedNFTs);
    mapofOwners.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user:Principal): async [Principal]{

    var userNFTs :List.List<Principal> = switch(mapofOwners.get(user)){
      case null List.nil<Principal>();
      case (?result) result;
    };

    // CONVERTING LIST TO AN ARRAY.
    return List.toArray(userNFTs);
  };

  public query func getListedNFTs(): async [Principal]{
    let ids = Iter.toArray(mapOfListings.keys());
    return ids;
  };

  
  public shared(msg) func listItem(id:Principal, price:Nat): async Text{
    var item : NFTActorClass.NFT = switch (mapofNFTs.get(id)){
      case null return "NFT does not exist";
      case (?result) result;
    };
    let owner = await item.getOwner();
    if(Principal.equal(owner, msg.caller)){
      let newListing : Listing = {
        itemOwner = owner; 
        itemPrice = price;
      };  
      mapOfListings.put(id, newListing);
      return "Success";
    }
    else{
      return "You don't Owned this NFTs";
    };
  };

  public query func getCanisterId(): async Principal{
    return Principal.fromActor(PixelPort);
  };

  public query func isListed(id:Principal):async Bool{
    if(mapOfListings.get(id) == null){
      return false;
    }
    else{
      return true
    }
  };

  public query func getOriginalOwner(id: Principal): async Principal{
    var listing : Listing = switch (mapOfListings.get(id)){
      case null return Principal.fromText("");
      case (?result) result;
    };
    
    return listing.itemOwner;
  };

  public query func getListedNFTPrice(id:Principal): async Nat{
    var listing : Listing = switch (mapOfListings.get(id)){
      case null return 0;
      case (?result) result;
    };

    return listing.itemPrice;
  };

  public shared(msg) func completePurchase(id:Principal, ownerId:Principal, newOwnerId:Principal): async Text{
    var purchasedNFT : NFTActorClass.NFT = switch (mapofNFTs.get(id)){
      case null return "NFT does not exist";
      case (?result) result;
    };

    let transferResult = await purchasedNFT.transferOwnerShip(newOwnerId);
    if(transferResult == "Success"){
      mapOfListings.delete(id);
      var ownedNFTs : List.List<Principal> = switch (mapofOwners.get(ownerId)){
        case null List.nil<Principal>();
        case (?result) result;
      };
      ownedNFTs := List.filter(ownedNFTs, func (listItemId:Principal) : Bool{
        return listItemId != id;
      });
      addToOwnershipMap(newOwnerId,id);
      return "Success";
    }
    else{
      return transferResult;
    };
  };
  

  //----------------------------------------------------------------------------------------------------------------------------//

  var tokenOwner : Principal = Principal.fromText("b62zc-lsgmp-n4oyi-pxfzi-ncb5l-hnlgl-5aura-o22kh-cvtxp-lklk4-tae"); 
  var totalSupply : Nat = 1000000000;
  totalSupply := 1000000000;
  var ourTokenSymbol : Text = "ICP";

  // OUR LEDGER IS JUST GOING TO BE A DATA STORE THAT STORES THE ID OF A PARTICULAR USER OR CANISTER AS WELL AMOUNT.'balances' IS OUR LEDGER.
  // LEDGER WILL STORE THE PRINCIPAL ID OF OWNER AND AMOUNT PRESENT IN THEIR WALLET.
  
  // THIS IS OUR TEMPORARY STABLE VARIABLE WHICH WILL STORE ID AND AMOUNT IN AN ARRAY IN THE FORM OF TUPLES.
  private stable var entries : [(Principal, Nat)] = [];
  // HASHMAPS CANNOT BE AN STABLE VARIABLE
  private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  // INITIALLY OUR LEDGER IS EMPTY DICTIONARY.
  // HASHMAPS ARE THE DICTIONARY WHICH CONSIST OF KEY AND VALUE. ====>     balances.put(k:key, v:value);
  // balances.put(tokenOwner, totalSupply);
    
  if(balances.size() < 1){
      balances.put(tokenOwner, totalSupply);
    };

  // HERE, THIS QUERY FUNCTION WILL TAKE PRINCIPAL ID AS ARGUMENT AND RETURN THE CURRENT BALANCE OF OWNER. 
  public query func balanceOf(who:Principal) : async Nat{
    var balance : Nat = switch (balances.get(who)){
      case null 0;
      case (?result) result; 
    };
    return balance;
  };

  // HERE, THIS FUNCTION WILL RETURN THE SYMBOL OF OUR TOKEN.
  public query func symbol():async Text{
    return ourTokenSymbol;
  };

  // HERE, 'shared' FUNCTION IS USED TO GET THE PRINCIPAL ID OF THE USER/OWNER.
  // 'msg.caller' ===> THIS WILL RETURN PRINCIPAL ID OF OWNER/USER WHO AUTHENTICATE ON OUR WEB APP.
  public shared(msg) func payOut() : async Text{
    Debug.print(debug_show(msg.caller));
    if(balances.get(msg.caller) == null){
      var amount : Nat = 10000;
      // amount := 10000;
      var result = await transfer(msg.caller, amount);
      return result;
    }else{
      return "Already Claimed!!!";
    };
     
  };

  //
  public shared(msg) func transfer(toAddress:Principal, amount:Nat): async Text{

      // THIS IS SENDER'S ACCOUNT
      let fromBalance = await balanceOf(msg.caller);
      if(fromBalance > amount){
        let fromAmount:Nat = fromBalance - amount;
        balances.put(msg.caller, fromAmount);

      // THIS IS RECIEVER'S ACCOUNT
        let toBalance = await balanceOf(toAddress);
        let toAmount:Nat = toBalance + amount;
        balances.put(toAddress, toAmount);
        
        return "Success✅";
      }
      else{
        return "Insufficient Fund"; 
      };
      
  };


  // STATE PRESERVATION ===>   The preupgrade method captures the current state by converting the map's entries to an array and storing it in a stable variable.
  system func preupgrade(){
    entries := Iter.toArray(balances.entries());

  };
  // STATE RESTORATION ===>  The postupgrade method restores the state by recreating the HashMap from the stored array of entries.
  system func postupgrade(){
    balances := HashMap.fromIter<Principal,Nat>(entries.vals(), 1, Principal.equal, Principal.hash);
    if(balances.size() < 1){
      balances.put(tokenOwner, totalSupply);
    }
  };

}