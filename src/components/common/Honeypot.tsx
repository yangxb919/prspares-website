'use client';

import { forwardRef } from 'react';
import { HONEYPOT_FIELD } from '@/lib/security/spam-checks';

/**
 * Visually hidden honeypot input. Rendered off-screen with tabindex=-1 and
 * autoComplete="off" so real users never interact with it. Bots fill every
 * input they find — the server rejects any submission where this comes back
 * non-empty.
 *
 * Usage (uncontrolled — read with a ref):
 *   const hpRef = useRef<HTMLInputElement>(null);
 *   <Honeypot ref={hpRef} />
 *   // on submit: hpRef.current?.value
 *
 * Or controlled:
 *   const [hp, setHp] = useState('');
 *   <Honeypot value={hp} onChange={(e) => setHp(e.target.value)} />
 */
const Honeypot = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Honeypot(props, ref) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label>
          Website (do not fill)
          <input
            ref={ref}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
            {...props}
          />
        </label>
      </div>
    );
  }
);

export default Honeypot;
