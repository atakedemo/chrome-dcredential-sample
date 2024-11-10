'use client'

declare global{
  interface Navigator {
    identity?: {
      get: (options: any) => Promise<{ data: any }>;
    };
  }

}

export default function Home() {
  const getIdentity = async () => {
    if (typeof navigator !== 'undefined' && navigator.identity) {
      const { data } = await navigator.identity.get({
        digital: {
          providers: [
            {
              protocol: 'openid4vp',
              request: {
                client_id: '111111',
                client_id_scheme: 'web-origin',
                response_type: 'vp_token',
                nonce: '111111',
                presentation_definition: {
                  id: 'mDL-request-demo',
                  input_descriptors: [
                    {
                      id: 'org.iso.18013.5.1.mDL',
                      format: {
                        mso_mdoc: {
                          alg: ['ES256'],
                        },
                      },
                      constraints: {
                        limit_disclosure: 'required',
                        fields: [
                          {
                            path: ["$['org.iso.18013.5.1']['family_name']"],
                            intent_to_retain: false,
                          },
                          {
                            path: ["$['org.iso.18013.5.1']['given_name']"],
                            intent_to_retain: false,
                          },
                          {
                            path: ["$['org.iso.18013.5.1']['age_over_21']"],
                            intent_to_retain: false,
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      })
      console.debug(data)
    } else {
      console.warn('navigator.identityがサポートされていません');
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>
        Sample Page
      </h1>
      <button 
        onClick={getIdentity}
        style={{backgroundColor: 'blue', color: 'white'}}
      >
        クリックして実行
      </button>
    </div>
  );
}
