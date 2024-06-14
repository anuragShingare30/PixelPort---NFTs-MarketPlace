import Text "mo:base/Text";
import Principal "mo:base/Principal"; 
import Nat8 "mo:base/Nat8"; 

// HERE WE ARE CREATING ACTOR CLASS TO CREATE CANISTER SMART CONTRACTS PROGRAMATICALLY.
actor class NFT(name:Text, owner:Principal, imageContent:[Nat8]) = this {
    
    // HERE WE HAVE CREATED NFT'S WHICH WILL HAVE THERE UNIQUE PRINCIPAL ID.
    private let itemName = name;
    private var nftOwner = owner;
    private let imageByte = imageContent;

    // THIS PUBLIC QUERY FUNCTION WILL RETURN THE NAME,OWNER ID AND IMAGE OF OUR UNIQUE NFT'S, WHEN WE PASSED THIS IN OUR FRONTEND
    public query func getName():async Text{
        return itemName;
    };
    public query func getOwner():async Principal{
        return nftOwner;
    };
    public query func getAssets():async [Nat8]{
        return imageByte;
    };
    // BY THIS FUNCTION WE CAN GET THE PRINCIPAL ID OF THIS ACTOR CLASS.
    public query func getCanisterId(): async Principal{
        return Principal.fromActor(this);
    };
 
    public shared(msg) func transferOwnerShip(newOwner:Principal): async Text{
         
        if(msg.caller == nftOwner){
            nftOwner := newOwner;
            return "Success"
        }
        else{
            return "Error: Not initiated by NFT owner";
        }
    }
} 
 



// dfx deploy nft --argument='("CryptoDunks #123", principal "b62zc-lsgmp-n4oyi-pxfzi-ncb5l-hnlgl-5aura-o22kh-cvtxp-lklk4-tae", (vec {137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 10; 0; 0; 0; 10; 8; 6; 0; 0; 0; 141; 50; 207; 189; 0; 0; 0; 1; 115; 82; 71; 66; 0; 174; 206; 28; 233; 0; 0; 0; 68; 101; 88; 73; 102; 77; 77; 0; 42; 0; 0; 0; 8; 0; 1; 135; 105; 0; 4; 0; 0; 0; 1; 0; 0; 0; 26; 0; 0; 0; 0; 0; 3; 160; 1; 0; 3; 0; 0; 0; 1; 0; 1; 0; 0; 160; 2; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 160; 3; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 0; 0; 0; 0; 59; 120; 184; 245; 0; 0; 0; 113; 73; 68; 65; 84; 24; 25; 133; 143; 203; 13; 128; 48; 12; 67; 147; 94; 97; 30; 24; 0; 198; 134; 1; 96; 30; 56; 151; 56; 212; 85; 68; 17; 88; 106; 243; 241; 235; 39; 42; 183; 114; 137; 12; 106; 73; 236; 105; 98; 227; 152; 6; 193; 42; 114; 40; 214; 126; 50; 52; 8; 74; 183; 108; 158; 159; 243; 40; 253; 186; 75; 122; 131; 64; 0; 160; 192; 168; 109; 241; 47; 244; 154; 152; 112; 237; 159; 252; 105; 64; 95; 48; 61; 12; 3; 61; 167; 244; 38; 33; 43; 148; 96; 3; 71; 8; 102; 4; 43; 140; 164; 168; 250; 23; 219; 242; 38; 84; 91; 18; 112; 63; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130;}))'



// ADDING THE BUYING NFT USING THE COMMAND LINE ARGUMENT.

// dfx canister call dpixelport_backend mint '(vec {137; 80; 78; 71; 13; 10; 26; 10; 0; 0; 0; 13; 73; 72; 68; 82; 0; 0; 0; 10; 0; 0; 0; 10; 8; 6; 0; 0; 0; 141; 50; 207; 189; 0; 0; 0; 1; 115; 82; 71; 66; 0; 174; 206; 28; 233; 0; 0; 0; 68; 101; 88; 73; 102; 77; 77; 0; 42; 0; 0; 0; 8; 0; 1; 135; 105; 0; 4; 0; 0; 0; 1; 0; 0; 0; 26; 0; 0; 0; 0; 0; 3; 160; 1; 0; 3; 0; 0; 0; 1; 0; 1; 0; 0; 160; 2; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 160; 3; 0; 4; 0; 0; 0; 1; 0; 0; 0; 10; 0; 0; 0; 0; 59; 120; 184; 245; 0; 0; 0; 113; 73; 68; 65; 84; 24; 25; 133; 143; 203; 13; 128; 48; 12; 67; 147; 94; 97; 30; 24; 0; 198; 134; 1; 96; 30; 56; 151; 56; 212; 85; 68; 17; 88; 106; 243; 241; 235; 39; 42; 183; 114; 137; 12; 106; 73; 236; 105; 98; 227; 152; 6; 193; 42; 114; 40; 214; 126; 50; 52; 8; 74; 183; 108; 158; 159; 243; 40; 253; 186; 75; 122; 131; 64; 0; 160; 192; 168; 109; 241; 47; 244; 154; 152; 112; 237; 159; 252; 105; 64; 95; 48; 61; 12; 3; 61; 167; 244; 38; 33; 43; 148; 96; 3; 71; 8; 102; 4; 43; 140; 164; 168; 250; 23; 219; 242; 38; 84; 91; 18; 112; 63; 0; 0; 0; 0; 73; 69; 78; 68; 174; 66; 96; 130;}, "StoneHearts #000")'

// dfx canister call dpixelport_backend listItem '(principal "gzy2o-r4aaa-aaaaa-qaatq-cai", 1000)'

// dfx canister id dpixelport_backend

// dfx canister  call gzy2o-r4aaa-aaaaa-qaatq-cai transferOwnerShip '(principal "avqkn-guaaa-aaaaa-qaaea-cai", true)'


// PASSING AMOUNT TO THE USER ACCOUNT

// LIVE_CANISTER_KEY="principal \"$( \dfx canister id dpixelport_backend )\""
// echo $LIVE_CANISTER_KEY
// dfx canister call dpixelport_backend transfer "($LIVE_CANISTER_KEY, 500_000_000)"