import database from '@react-native-firebase/database';

var user = null;

export function SetUser(value) {
  user = value;
}

export function Database() {
  return database();
}

export function CreateUser(callback) {
  database().ref(`/users/${user.uid}`)
    .once('value')
    .then((snapshot) => {
      // return if the user exists
      if (snapshot.exists()) {
        callback(false);
        return;
      }

      CreateUserInternal(callback);
    });
}

function CreateUserInternal(callback) {
  database().ref(`/users/${user.uid}`)
    .set({role: ''})
    .then(() => {
      callback(true);
    })
    .catch((error) => {
      console.log(error);
      callback(false);
    })
}

export function GetRole(callback) {
  database().ref(`/users/${user.uid}`)
    .once('value')
    .then((snapshot) => {
      callback(snapshot.val().role);
    })
    .catch((error) => {
      console.log(error);
    });
}

export function UpdateRole(role, callback) {
  database().ref(`/users/${user.uid}`)
  .set({role: role})
  .then(() => {
    callback(true);
  })
  .catch(() => {
    callback(false);
  })
}

export function CreateProduction(id, callback) {
  const item = {}
  item[id] = 0;

  database().ref(`/makers/${user.uid}/`)
    .update(item)
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
}

export function RemoveProduction(id, callback) {
  database().ref(`/makers/${user.uid}/${id}`)
  .set(null)
  .then(() => {
    callback(true);
  })
  .catch(() => {
    callback(false);
  });
}

export function GetQuantity(callback) {
  database().ref(`/makers/${user.uid}/`)
    .once('value')
    .then((snapshot) => {
      callback(snapshot.val());
    })
    .catch(() => {
      callback(null);
    });
}

export function UpdateQuantity(quantity, callback) {
  database().ref(`/makers/${user.uid}`)
    .update({
      'quantity': quantity
    })
    .then(() => {
      callback(true);
    })
    .catch((error) => {
      console.log(error);
      callback(false);
    });
}

export function DecreaseQuantity(id, callback) {
  database().ref(`/makers/${user.uid}/${id}`)
    .transaction(currentQuantity => {
      return currentQuantity - 1;
    })
    .then((transaction) => {
      callback(transaction.snapshot.val());
    });
}

export function IncreaseQuantity(id, callback) {
  database().ref(`/makers/${user.uid}/${id}`)
    .transaction(currentQuantity => {
      return currentQuantity + 1;
    })
    .then((transaction) => {
      callback(transaction.snapshot.val());
    });
}

export function GetProfile(callback) {
  database().ref(`/profiles/${user.uid}`)
    .once('value')
    .then((snapshot) => {
      callback(snapshot.val());
    });
}

export function UpdateProfile(profile, callback) {
  database().ref(`/profiles/${user.uid}`)
    .update({
      'name': profile.name,
      'address': profile.address,
      'phone': profile.phone,
      'coordinates': profile.coordinates
    })
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
}

export function UpdateMaterials(materials, callback) {
  database().ref(`/makers/${user.uid}`)
    .update({
      'materials': materials,
    })
    .then(() => {
      callback(true);
    })
    .catch(() => {
      callback(false);
    });
}
