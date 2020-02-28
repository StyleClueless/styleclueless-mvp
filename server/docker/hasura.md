mutation MyMutation {
  __typename
  insert_companies(objects: {company_name: "Dorthy Perkins", created_at: "now()", updated_at: "now()"}) {
    returning {
      company_name
      id,created_at
    }
  }
}



mutation MyMutation {
  __typename
  insert_clients(objects: {company_id: "c5a66f3a-b46b-4165-815a-86ec68741b6f", created_at: "now()", email: "zobis2@gmail.com", password: "123456", updated_at: "now()"}) {
    returning {
      id
      created_at
    }
  }
}


mutation MyMutation {
  __typename
  insert_tagging(objects: {class: "CLASSS", code: "ABC-333", company_id: "c5a66f3a-b46b-4165-815a-86ec68741b6f", 
    created_at: "now()", demography: "", design: "", shade: "", style: "", updated_at: "now()"}) {
    returning {
      id
      code
    }
  }
}
mutation MyMutation {
  __typename
  insert_outfits(objects: {bottom: "5aab452b-5bb3-492e-83cb-fca5625390d2", tagging_id: "626d55c7-a085-43b9-8e73-0f568a6cffeb", 
    created_at: "now()", updated_at: "now()"}) {
    returning {
      tagging_id
      id
    }
  }
}
