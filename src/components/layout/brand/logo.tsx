import siteConfig from "@/config/site"
import { cn } from "@/lib/utils"
import { Homemade_Apple } from "next/font/google"

const homemadeApple = Homemade_Apple({
	weight: "400",
	subsets: ["latin"]
})

const BrandLogo = () => {
	return (
		<div className={cn(homemadeApple.className, "font-semibold text-2xl text-orange-600")}>
			{siteConfig.name}
		</div>
	)
}

export default BrandLogo
