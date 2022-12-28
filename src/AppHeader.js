function AppHeader(props) {
    return <header className="App-header" data-state={props.state}>
        <svg width="100%" height="100%" id="svg" viewBox="0 0 1440 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio='none'><path d="M 0,500 C 0,500 0,100 0,100 C 115.20574162679426,117.33014354066985 230.41148325358853,134.6602870813397 327,134 C 423.58851674641147,133.3397129186603 501.5598086124402,114.688995215311 590,99 C 678.4401913875598,83.311004784689 777.3492822966508,70.58373205741628 873,78 C 968.6507177033492,85.41626794258372 1061.043062200957,112.97607655502392 1155,120 C 1248.956937799043,127.02392344497608 1344.4784688995214,113.51196172248804 1440,100 C 1440,100 1440,500 1440,500 Z" stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="0.265" className="transition-all duration-300 ease-in-out delay-150 path-0"></path><path d="M 0,500 C 0,500 0,200 0,200 C 81.22488038277513,200.59330143540672 162.44976076555025,201.1866028708134 264,200 C 365.55023923444975,198.8133971291866 487.42583732057415,195.8468899521531 584,194 C 680.5741626794259,192.1531100478469 751.846889952153,191.42583732057415 833,194 C 914.153110047847,196.57416267942585 1005.1866028708134,202.44976076555025 1108,204 C 1210.8133971291866,205.55023923444975 1325.4066985645932,202.77511961722487 1440,200 C 1440,200 1440,500 1440,500 Z" stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="0.4" className="transition-all duration-300 ease-in-out delay-150 path-1"></path><path d="M 0,500 C 0,500 0,300 0,300 C 97.05263157894734,301.9043062200957 194.10526315789468,303.8086124401914 273,297 C 351.8947368421053,290.1913875598086 412.63157894736855,274.66985645933016 522,273 C 631.3684210526314,271.33014354066984 789.3684210526314,283.511961722488 890,296 C 990.6315789473686,308.488038277512 1033.8947368421054,321.2822966507177 1116,322 C 1198.1052631578946,322.7177033492823 1319.0526315789473,311.3588516746412 1440,300 C 1440,300 1440,500 1440,500 Z" stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="0.53" className="transition-all duration-300 ease-in-out delay-150 path-2"></path><path d="M 0,500 C 0,500 0,400 0,400 C 126.09569377990434,409.8373205741627 252.19138755980867,419.67464114832535 331,416 C 409.8086124401913,412.32535885167465 441.33014354066984,395.1387559808613 525,389 C 608.6698564593302,382.8612440191387 744.4880382775121,387.7703349282296 858,389 C 971.5119617224879,390.2296650717704 1062.7177033492821,387.77990430622015 1156,389 C 1249.2822966507179,390.22009569377985 1344.641148325359,395.1100478468899 1440,400 C 1440,400 1440,500 1440,500 Z" stroke="none" strokeWidth="0" fill="#0693e3" fillOpacity="1" className="transition-all duration-300 ease-in-out delay-150 path-3"></path></svg>

        <div>{props.message}</div>
    </header>
}

export default AppHeader;