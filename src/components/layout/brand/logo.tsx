import siteConfig from "@/config/site"
import { cn } from "@/lib/utils"
import Image from "next/image"

const BrandLogo = () => {
	return (
		<div className={cn("flex flex-col justify-center gap-2")}>
			<Image src="/pepe.svg" alt="logo" width={60} height={60} />
			<div className={cn("font-semibold text-primary text-xl")}>{siteConfig.name}</div>
		</div>
	)
}

export default BrandLogo
