const data = {
    users : [
    {
        Id : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
        FirstName : "John",
        LastMiddleName : "Smith",
        EmailContact: "john.smith@gmail.com",
        CellphoneContact: "0845571902",
        Username: "JohnnoSmith",
        Password: "Password123",
        RegistrationDate: "2023-08-01",
        LastUpdateDate: "",
        IdentityNumber: "0402981992002",
        LogoImageId: "",
    },
    {
        Id : "e2632c5b-d6b9-45d0-a08c-74952d80ed8c",
        FirstName : "Jane",
        LastMiddleName : "De Villiers",
        EmailContact: "JaneDV@gmail.com",
        CellphoneContact: "0845571902",
        Username: "JaneDV",
        Password: "Password123",
        RegistrationDate: "2023-08-01",
        LastUpdateDate: "2023-08-03",
        IdentityNumber: "0109291943098",
        LogoImageId: "",
    },
    {
        Id: "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        FirstName: "Alice",
        LastMiddleName: "Johnson",
        EmailContact: "alice.johnson@gmail.com",
        CellphoneContact: "0812345678",
        Username: "AliceJ",
        Password: "Password123",
        RegistrationDate: "2023-08-05",
        LastUpdateDate: "",
        IdentityNumber: "0112345678901",
        LogoImageId: "",
    },
    {
        Id: "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        FirstName: "Bob",
        LastMiddleName: "White",
        EmailContact: "bob.white@gmail.com",
        CellphoneContact: "0823456789",
        Username: "BobW",
        Password: "Password123",
        RegistrationDate: "2023-08-05",
        LastUpdateDate: "",
        IdentityNumber: "0213456789012",
        LogoImageId: "",
    },
    {
        Id: "6a883935-2f68-47f8-8c15-747c472fab70",
        FirstName: "Eve",
        LastMiddleName: "Anderson",
        EmailContact: "eve.anderson@gmail.com",
        CellphoneContact: "0834567890",
        Username: "EveA",
        Password: "Password123",
        RegistrationDate: "2023-08-05",
        LastUpdateDate: "",
        IdentityNumber: "0314567890123",
        LogoImageId: "",
    },
    {
        Id: "b8e1f8d3-4dcc-47ca-a1c3-449038bb8e94",
        FirstName: "Michael",
        LastMiddleName: "Brown",
        EmailContact: "michael.brown@gmail.com",
        CellphoneContact: "0845678901",
        Username: "MichaelB",
        Password: "Password123",
        RegistrationDate: "2023-08-05",
        LastUpdateDate: "",
        IdentityNumber: "0415678901234",
        LogoImageId: "",
    }
],

products : [
    {
        Id : "c4338396-066c-47bb-b9de-b754927b4991",
        Title : "HDD Camera",
        Description: "A wonderful camera design that remains timeless. It takes good pictures aswell.",
        Price : 2899.99,
        AvailableQuantity : 1,
        IsAvailable : false,
        FeaturePoints : 4,
        ProductImages : [
            {
                ImageId : "4371bc31-d9af-4e01-a0e4-abc5dbf04df8"
            },
            {
                ImageId : "cc72f202-518e-4f36-9236-05696b9524fc"
            }

        ],
        UploaderId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",

    },
    {
        Id : "32511639-0a38-49ec-ba1c-3a64288d2a0d",
        Title : "HDRX Camera",
        Description: "High definition camera, optimal for photographing scenery and sporting events",
        Price : 3999.99,
        AvailableQuantity : 1,
        IsAvailable : true,
        FeaturePoints : 4,
        ProductImages : [
            {
                ImageId : "611d3c7b-94be-4726-9756-820fd7724396"
            },
            {
                ImageId : "cd934a19-2976-4447-975a-d353123e2ce2"
            }
            
            
        ],
        UploaderId : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
    },
    {
        Id: "d6a2a3c9-8455-49af-9d4d-d2d68d5efee7",
        Title: "Professional Drone",
        Description: "An advanced drone for capturing stunning aerial shots.",
        Price: 5499.99,
        AvailableQuantity: 3,
        IsAvailable: true,
        FeaturePoints: 5,
        ProductImages: [
          { ImageId: "b83dea38-ba9f-49e3-b227-52d9709dfb72" },
          { ImageId: "2c289a4e-bda8-4043-8121-f468d2609040" }
        ],
        UploaderId: "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8"
      },
      {
        Id: "efcfeaac-ef77-4c67-b547-8bb80e259862",
        Title: "Smartphone Gimbal",
        Description: "A handheld stabilizer for smooth video recording with your smartphone.",
        Price: 199.99,
        AvailableQuantity: 10,
        IsAvailable: true,
        FeaturePoints: 4,
        ProductImages: [
          { ImageId: "bd065c91-4b60-4f44-bb1b-d2c7abe044fe" },
          { ImageId: "573e270a-6c6d-4379-a418-693e55a6a164" }
        ],
        UploaderId: "03375a74-f9f4-4c1b-92d2-6f7a28479521"
      },
      {
        Id: "c56a15d0-e425-49a2-9b1c-78e0e358755f",
        Title: "Gopro",
        Description: "Capture your underwater adventures with this rugged action camera.",
        Price: 1499.99,
        AvailableQuantity: 2,
        IsAvailable: true,
        FeaturePoints: 3,
        ProductImages: [
          { ImageId: "71fecb5b-8d47-4145-a864-f012c759c2b4" }
        ],
        UploaderId: "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8"
      },
      {
        Id: "ae30b434-94ef-4b4f-a051-234ee0f7c437",
        Title: "Mirrorless Camera",
        Description: "A compact and powerful camera for enthusiasts and professionals.",
        Price: 3299.99,
        AvailableQuantity: 5,
        IsAvailable: true,
        FeaturePoints: 5,
        ProductImages: [
          { ImageId: "1049fd93-37c5-4de9-9e07-612ebcc90605" },
          { ImageId: "abdf74b8-6006-472a-83ae-c6543d875af4" }
        ],
        UploaderId: "71ffe407-e5cc-42b4-b979-f1484f26acb8"
      },
      {
        Id: "f8aeb09a-2f49-4b63-8794-bff50bb2396f",
        Title: "Camera Lens Kit",
        Description: "A versatile lens kit for various photography needs.",
        Price: 799.99,
        AvailableQuantity: 7,
        IsAvailable: true,
        FeaturePoints: 4,
        ProductImages: [
          { ImageId: "c05dc378-f67d-44cb-ab75-9e9bac7ec60d" }
        ],
        UploaderId: "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8"
      },

],

favourites : [
    {
        Id : "5a47b21a-9d91-482c-9030-ff1be5196991",
        ProductId : "ae30b434-94ef-4b4f-a051-234ee0f7c437",
        UserId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        Note : "Add this to the list of items I want to purchase when I get my salary",
    },
    {
        Id : "57ae951b-3f2c-4fd6-9a51-3b2843d930a2",
        ProductId : "ae30b434-94ef-4b4f-a051-234ee0f7c437",
        UserId : "",
        Note : "This would go really well with the camera from Bobby",
    },
    {
        Id : "7b89d266-bd61-4eb8-bda4-51be928d444d",
        ProductId : "6a883935-2f68-47f8-8c15-747c472fab70",
        UserId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        Note : "If available by Sunday, reminder to purchase this",
    },
    {
        Id : "8bdfd155-f65f-4b69-a0b1-e6e9e31d94db",
        ProductId : "efcfeaac-ef77-4c67-b547-8bb80e259862",
        UserId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        Note : "",
    },
    {
        Id : "93de31ee-d184-40fd-bc68-d001513b7fc6",
        ProductId : "c4338396-066c-47bb-b9de-b754927b4991",
        UserId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        Note : "",
    }

],

transactions : [
    {
        Id : "df04f0db-dfab-4329-bb91-e9645542d9e6",
        DateFinalised : "2023-08-05",
        BuyerId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        SellerId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        LocationAgreementId : "5a084286-e170-4a82-9d76-bcf654b31d86",
        ProductId : "c4338396-066c-47bb-b9de-b754927b4991",
        ServiceFee : 15.99,
        FinalCharge : 1000,
    },
    {
        Id : "1cf4cbd8-4b4b-470a-b918-902247df9b95",
        DateFinalised : "2023-08-09",
        BuyerId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        SellerId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        LocationAgreementId : "2b24270e-ee66-4e6a-a7e6-a2c8e934138f",
        ProductId : "efcfeaac-ef77-4c67-b547-8bb80e259862",
        ServiceFee : 10.99,
        FinalCharge : 1000,
    },
    {
        Id : "d4967c68-cc03-45be-b474-985efb07e81d",
        DateFinalised : "2023-08-02",
        BuyerId : "6a883935-2f68-47f8-8c15-747c472fab70",
        SellerId : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
        LocationAgreementId : "1fafd9e7-feea-4839-8df3-fce3eed43bd9",
        ProductId : "d6a2a3c9-8455-49af-9d4d-d2d68d5efee7",
        ServiceFee : 19.99,
        FinalCharge : 1000,
    },
],

locationagreements : [
    {
        Id : "5a084286-e170-4a82-9d76-bcf654b31d86",
        LocationName: "Vida On Kloof, Tamboerskloof",
        MeetingDate: "2023-08-14",
        MeetingTime : "18:00",
        BothPartyAgreement : true,
    },
    {
        Id : "2b24270e-ee66-4e6a-a7e6-a2c8e934138f",
        LocationName: "Apache Spur, Newlands",
        MeetingDate: "2023-08-19",
        MeetingTime : "15:45",
        BothPartyAgreement : true,
    },
    {
        Id : "1fafd9e7-feea-4839-8df3-fce3eed43bd9",
        LocationName: "Bootleggers, Constantia",
        MeetingDate: "2023-08-23",
        MeetingTime : "13:30",
        BothPartyAgreement : true,
    },

],

reviews : [
    {
        Id : "4a6dae64-db5b-452b-b052-e9bb2db4c985",
        Overview : "Highly positive",
        TransactionId : "df04f0db-dfab-4329-bb91-e9645542d9e6",
        Contents : "This transaction went really well and the experience was an overall positive. Very nice seller.",
        Rating : "8.8",
        TargetUserId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        ReviewerId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
    },
    {
        Id : "88f8e985-3e21-4bb1-915d-9dad8b7e6256",
        Overview : "Neutral",
        TransactionId : "1cf4cbd8-4b4b-470a-b918-902247df9b95",
        Contents : "The seller was very cold and not very responsive. The interaction didn't make me feel like I was part of a community",
        Rating : "4.4",
        TargetUserId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        ReviewerId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
    },
    {
        Id : "7e5e694f-bee5-4032-900e-facc212a7ac9",
        Overview : "Negative",
        TransactionId : "d4967c68-cc03-45be-b474-985efb07e81d",
        Contents : "Horribly rude seller. I never want to interact with her again.",
        Rating : "2.4",
        TargetUserId : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
        ReviewerId : "6a883935-2f68-47f8-8c15-747c472fab70",
    },

],

ratings :[
    {
        Id : "4f530790-49cf-4d61-9bfb-dd5c435605ef",
        UserId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        Rating : 6.6,
        NumberReviews : 2,
        Reviews : [
            {
                ReviewId : "4a6dae64-db5b-452b-b052-e9bb2db4c985"
            },
            {
                ReviewId : "88f8e985-3e21-4bb1-915d-9dad8b7e6256"
            }
                
                
        ]
    },
    {
        Id : "58cbab28-89e1-413a-bd2b-2f6853718d6f",
        UserId : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
        Rating : 2.4,
        NumberReviews : 1,
        Reviews : [
                {
                    ReviewId : "7e5e694f-bee5-4032-900e-facc212a7ac9"
                }
        ]
    }
],


roles : [
    {
        Id : "322328df-aae6-460b-a90a-23173147d693",
        Name : "Admin",
    },
    {
        Id : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
        Name : "User",
    }
],

userroles : [
    {
        UserId : "7f74726f-3fc5-4274-b6e6-bc3ddf439fe8",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "e2632c5b-d6b9-45d0-a08c-74952d80ed8c",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "03375a74-f9f4-4c1b-92d2-6f7a28479521",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "71ffe407-e5cc-42b4-b979-f1484f26acb8",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "6a883935-2f68-47f8-8c15-747c472fab70",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "b8e1f8d3-4dcc-47ca-a1c3-449038bb8e94",
        RoleId : "5ec2f684-ba51-4b99-a708-6159c6c842f1",
    },
    {
        UserId : "b8e1f8d3-4dcc-47ca-a1c3-449038bb8e94",
        RoleId : "322328df-aae6-460b-a90a-23173147d693",
    }
],

images : [
    {
        Id : "4371bc31-d9af-4e01-a0e4-abc5dbf04df8",
        Alternative :"HDDCamera1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/HDDCamera1.jpg",
        
    },
    {
        Id : "cc72f202-518e-4f36-9236-05696b9524fc",
        Alternative :"HDDCamera2",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/HDDCamera2.jpg",
    },
    {
        Id : "611d3c7b-94be-4726-9756-820fd7724396",
        Alternative :"HDRXCamera1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/HDRXCamera1.jpeg",
    },
    {
        Id : "cd934a19-2976-4447-975a-d353123e2ce2",
        Alternative :"HDRXCamera2",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/HDRXCamera2.jpg",
    },
    {
        Id : "b83dea38-ba9f-49e3-b227-52d9709dfb72",
        Alternative :"Drone1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Drone1.jpg",
    },
    {
        Id : "2c289a4e-bda8-4043-8121-f468d2609040",
        Alternative :"Drone2",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Drone2.jpg",
    },
    {
        Id : "bd065c91-4b60-4f44-bb1b-d2c7abe044fe",
        Alternative :"Gimbal1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Gimbal1.png",
    },
    {
        Id : "573e270a-6c6d-4379-a418-693e55a6a164",
        Alternative :"Gimbal2",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Gimbal2.jpg",
    },
    {
        Id : "71fecb5b-8d47-4145-a864-f012c759c2b4",
        Alternative :"Gopro1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Gopro1.jpg",
    },
    {
        Id : "1049fd93-37c5-4de9-9e07-612ebcc90605",
        Alternative :"MirrorlessCamera1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Mirrorlesscamera1.jpg",
    },
    {
        Id : "abdf74b8-6006-472a-83ae-c6543d875af4",
        Alternative :"MirrorlessCamera2",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/Mirrorlesscamera2.jpg",
    },
    {
        Id : "c05dc378-f67d-44cb-ab75-9e9bac7ec60d",
        Alternative :"CameraLens1",
        Width: "400",
        Height: "400",
        URL: "/ProductImages/CameraLens.jpg",
    },
    {
        Id : "8401f0a7-bf54-4345-a071-a9601f19ed42",
        Alternative :"Alice",
        Width: "400",
        Height: "400",
        URL: "/UserImages/Alice.jpg",
    },
    {
        Id : "07558551-9ef0-434a-8a67-e66aadf2da5b",
        Alternative :"BobWhite",
        Width: "400",
        Height: "400",
        URL: "/UserImages/BobWhite.jpg",
    },
    {
        Id : "def79d98-c66f-4a6e-8fb4-1838bf6c5532",
        Alternative :"JaneDV",
        Width: "400",
        Height: "400",
        URL: "/UserImages/JaneDV.jpg",
    },
    {
        Id : "a6175ecb-fe4b-471b-a1c9-9ce4e8ee4593",
        Alternative :"JohnSmith",
        Width: "400",
        Height: "400",
        URL: "/UserImages/JohnSmith.jpg",
    },
    
],

videos :[
    {

    }
],

communications :[
    {

    }
],

sessions : [
    {

    }
]

}

export {
    data
}