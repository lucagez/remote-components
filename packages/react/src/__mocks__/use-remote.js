import React, { useState, useEffect } from 'react';
import { act } from '@testing-library/react';

import DUMMY_RES from '../../tests/mocks/dummy';
import WRONG_RES from '../../tests/mocks/wrong';
import BROKEN_RES from '../../tests/mocks/broken';

const responses = {
  dummy: DUMMY_RES,
  wrong: WRONG_RES,
  broken: BROKEN_RES,
};

const useRemote = ({ url }) => {
  const [state, setState] = useState({ loading: true });

  const timeoutUpdate = () => setTimeout(() => {
    act(() => {
      if (/error/.test(url)) {
        setState({
          error: new Error(),
        });
      }
      if (/wrong/.test(url)) {
        setState({
          data: { default: () => <div>dummy</div> },
        });
      }
      setState({
        data: { default: () => <div>dummy</div> },
      });
    });
  }, 100);

  useEffect(() => {
    // asyncUpdate(100).then(() => {
    //   // switch (url) {
    //   //   case 'dummy':
    //   //     setState({
    //   //       data: () => (
    //   //         <div>DUMMY</div>
    //   //       ),
    //   //     });
    //   //     break;
    //   //   default:
    //   //     break;
    //   // }

    //   setState({
    //     data: { default: () => <div>dummy</div> },
    //   });
    // });

    timeoutUpdate();
  }, []);

  return { data: state.data, loading: state.loading };
};

export { useRemote };
