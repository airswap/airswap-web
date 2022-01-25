import { FC } from "react";
import Page from '../Page/Page';

const Whitepaper: FC = () => {

    return (
        <>
            <Page>
                <div>
                    <a
                        href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        download
                        target="_blank"
                    >
                        Download Airswap Whitepaper.
                    </a>
                </div>
            </Page>

        </>
    );
};

export default Whitepaper;
