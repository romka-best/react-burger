export const isCorrectEmail = (email: string) => {
  return Boolean(
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  );
};

export const isCorrectPassword = (password: string) => {
  return Boolean(
    String(password)
      .match(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/
      )
  );
}

export const isCorrectName = (name: string) => {
  return Boolean(
    String(name)
      .match(
        /^[0-9a-zA-Z]{2,}$/
      )
  )
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(name: string, value: null | string, props: { [x: string]: any; expires: any }) {
  if (props.expires) {
    const d = new Date();
    d.setTime(d.getTime() + props.expires * 1000);
    props.expires = d;
  }
  if (props.expires && props.expires.toUTCString) {
    props.expires = props.expires.toUTCString();
  }
  if (value) {
    value = encodeURIComponent(value);
  }
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, null, {expires: -1});
}
