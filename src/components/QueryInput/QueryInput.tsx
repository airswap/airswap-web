import { useState } from 'react';
import { useTranslation } from "react-i18next";

const QueryInput = () => {
    const [amount, setAmount] = useState<number>(0.0);
    const { t } = useTranslation(["balances", "common"]);

    return (
        <div>
            <h2>Swap now</h2>
            <form>
                <label htmlFor="swap-amount">Send</label>
                <input 
                    type="text" 
                    id="swap-amount"
                    value={amount}
                    onChange={e => setAmount(parseFloat(e.target.value))}
                />
                
            </form>
        </div>
    )

}

export default QueryInput;